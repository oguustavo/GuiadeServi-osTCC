// Importa os modelos e o Sequelize Op
const User = require('../models/User');
const PremiumPost = require('../models/PremiumPost');
const { Op } = require('sequelize');

// Importa as classes do novo SDK do Mercado Pago usando require (para compatibilidade CommonJS)
const { MercadoPagoConfig, Payment } = require('mercadopago');

// --- Configuração do Mercado Pago ---
// Public Key: TEST-ea107aab-46ea-43d7-a7c6-75cfa0f8f772
const client = new MercadoPagoConfig({
    accessToken: 'TEST-5354517982252470-061823-9b422aa0f60eba6d823b6c8dd6c7a5ad-475139753', // SEU TOKEN AQUI
    options: { timeout: 5000 },
});

// Inicializa o objeto da API para pagamentos
const payment = new Payment(client);

// Detalhes dos planos premium
const PLAN_DETAILS = {
    basic: {
        name: 'Básico',
        price: 10,
        description: '1 vaga para divulgar, destaque por 3 dias',
        postsAllowed: 1,
        daysValid: 30
    },
    grande: {
        name: 'Grande',
        price: 20,
        description: 'Até 3 vagas para divulgar, destaque por 5 dias',
        postsAllowed: 3,
        daysValid: 30
    },
    gigante: {
        name: 'Gigante',
        price: 30,
        description: 'Até 4 vagas para divulgar, destaque por 7 dias',
        postsAllowed: 4,
        daysValid: 30
    },
    master: {
        name: 'Master',
        price: 50,
        description: 'Até 8 vagas para divulgar, vagas fixas no topo',
        postsAllowed: 8,
        daysValid: 30
    }
};

// Classe do controlador premium
module.exports = class PremiumController {
    static async showPremiumPage(req, res) {
        if (!req.session.userid) {
            req.flash('message', 'Faça login ou cadastre-se para acessar os recursos premium');
            req.flash('info', true);
            res.render('premium/premium', {
                notLogged: true,
                message: 'Faça o registro agora para acessar a opção de ser premium!'
            });
            return;
        }
        res.render('premium/premium', {
            notLogged: false
        });
    }

    static async showPaymentPage(req, res) {
        const planType = req.params.planType;
        const planDetails = PLAN_DETAILS[planType];

        if (!planDetails) {
            req.flash('message', 'Plano inválido');
            req.flash('error', true);
            return res.redirect('/premium');
        }
        res.render('premium/payment', {
            planType,
            planName: planDetails.name,
            planPrice: planDetails.price,
            planDescription: planDetails.description
        });
    }

    static async processPayment(req, res) {
        const planType = req.body.planType;
        const planDetails = PLAN_DETAILS[planType];

        if (!planDetails) {
            req.flash('message', 'Plano inválido');
            req.flash('error', true);
            return res.redirect('/premium');
        }

        try {
            console.log('--- Iniciando processPayment ---');
            console.log('planType:', planType);
            console.log('planDetails:', planDetails);

            const user = await User.findByPk(req.session.userid);

            if (!user) {
                console.log('Usuário não encontrado na sessão.');
                req.flash('message', 'Usuário não encontrado para processar o pagamento.');
                req.flash('error', true);
                return res.redirect('/premium');
            }
            console.log('Usuário encontrado:', user.email || user.name);            const body = {
                transaction_amount: Number(planDetails.price),
                description: `Plano Premium: ${planDetails.name}`,
                payment_method_id: 'pix',
                payer: {
                    email: user.email,
                    first_name: user.name || 'Usuário',
                    identification: {
                        type: 'CPF',
                        number: '19119119100'
                    }
                },
            };
            console.log('Corpo da requisição para Mercado Pago:', JSON.stringify(body, null, 2));


            const response = await payment.create({ body });
            console.log('--- Resposta do Mercado Pago recebida ---');
            console.log('Resposta completa:', JSON.stringify(response, null, 2));

            // Verifica se a resposta contém os dados do PIX
            if (response && response.point_of_interaction && response.point_of_interaction.transaction_data) {
                const pixData = response.point_of_interaction.transaction_data;
                console.log('Dados do PIX encontrados na resposta.');
                console.log('pixQrCodeBase64 (primeiros 50 chars):', pixData.qr_code_base64 ? pixData.qr_code_base64.substring(0, 50) + '...' : 'N/A');

                // Renderiza a página com os dados do PIX
                return res.render('premium/payment', {
                    planType,
                    planName: planDetails.name,
                    planPrice: planDetails.price,
                    pixQrCode: pixData.qr_code,
                    pixQrCodeBase64: pixData.qr_code_base64,
                    pixCopyPaste: pixData.qr_code,
                    pixExpiration: pixData.expiration_date,
                    pixTicketUrl: pixData.ticket_url,
                    showPix: true // Esta flag é usada pelo Handlebars
                });
            } else {
                console.log('Resposta do Mercado Pago não contém dados de PIX esperados. Redirecionando...');
                req.flash('message', 'O Mercado Pago não retornou os dados completos do PIX. Tente novamente.');
                req.flash('error', true);
                // Pode ser útil renderizar a mesma página sem o showPix para mostrar a mensagem de erro
                return res.render('premium/payment', {
                    planType, planName: planDetails.name, planPrice: planDetails.price, showPix: false
                });
            }

        } catch (error) {
            console.error('--- ERRO CATCH NO processPayment ---');
            console.error('Erro ao processar pagamento com Mercado Pago:', error);
            if (error.cause && error.cause.length > 0) {
                console.error('Detalhes do Erro Mercado Pago (cause):', error.cause);
            }
            if (error.status) {
                console.error('Status HTTP do Erro:', error.status);
            }
            req.flash('message', 'Erro ao iniciar pagamento com Mercado Pago. Por favor, tente novamente.');
            req.flash('error', true);
            req.session.save(() => {
                res.redirect('/premium');
            });
        }
    }

    // ... (restante do seu controlador permanece o mesmo) ...
    static async showPostForm(req, res) {
        const user = await User.findByPk(req.session.userid)

        if (!user.isPremium || user.premiumPostsRemaining <= 0) {
            req.flash('message', 'Você precisa ser um usuário premium para publicar')
            req.flash('error', true)
            return res.redirect('/premium')
        }

        res.render('premium/post-form', {
            postsRemaining: user.premiumPostsRemaining
        })
    }

    static async createPost(req, res) {
        const user = await User.findByPk(req.session.userid)

        if (!user.isPremium || user.premiumPostsRemaining <= 0) {
            req.flash('message', 'Você precisa ser um usuário premium para publicar')
            req.flash('error', true)
            return res.redirect('/premium')
        }

        try {
            const { title, whatsappLink, workType, description } = req.body
            const coverImage = req.file ? req.file.path : null

            // Validar descrição
            if (description && description.length > 100) {
                req.flash('message', 'A descrição deve ter no máximo 100 caracteres.')
                req.flash('error', true)
                return res.redirect('/premium/post-form')
            }

            const post = await PremiumPost.create({
                title,
                description,
                coverImage,
                whatsappLink,
                workType,
                UserId: user.id,
                expiresAt: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) // 30 days
            })

            user.premiumPostsRemaining--
            await user.save()

            req.flash('message', 'Post criado com sucesso!')
            req.flash('success', true)
            req.session.save(() => {
                res.redirect('/eventos/outrosServicos')
            })
        } catch (error) {
            console.error(error)
            req.flash('message', 'Erro ao criar post')
            req.flash('error', true)
            req.session.save(() => {
                res.redirect('/premium/post-form')
            })
        }
    }

    static async showProfilePage(req, res) {
        if (!req.session.userid) {
            req.flash('message', 'Você precisa estar logado para acessar esta página.')
            req.flash('error', true)
            return res.redirect('/login')
        }

        try {
            const user = await User.findByPk(req.session.userid, {
                include: PremiumPost
            })

            if (!user) {
                req.flash('message', 'Usuário não encontrado.')
                req.flash('error', true)
                return res.redirect('/login')
            }

            // Converter posts para formato plano
            const userPosts = user.PremiumPosts.map(post => post.get({ plain: true }))

            // Formatar data de expiração do plano
            let premiumExpiresFormatted = null
            if (user.premiumExpiresAt) {
                premiumExpiresFormatted = new Date(user.premiumExpiresAt).toLocaleDateString('pt-BR')
            }

            res.render('premium/profile', {
                user: user.get({ plain: true }),
                premiumPlanDetails: PLAN_DETAILS[user.premiumPlan] || null,
                premiumExpiresFormatted,
                userPosts
            })

        } catch (error) {
            console.error(error)
            req.flash('message', 'Erro ao carregar perfil.')
            req.flash('error', true)
            res.redirect('/')
        }
    }

    static async cancelPremium(req, res) {
        if (!req.session.userid) {
            req.flash('message', 'Acesso negado.')
            req.flash('error', true)
            return res.redirect('/login')
        }

        try {
            const user = await User.findByPk(req.session.userid)
            if (!user) {
                req.flash('message', 'Usuário não encontrado.')
                req.flash('error', true)
                return res.redirect('/login')
            }

            user.isPremium = false
            user.premiumPlan = null
            user.premiumExpiresAt = null
            user.premiumPostsRemaining = 0
            await user.save()

            req.flash('message', 'Seu plano premium foi cancelado com sucesso.')
            req.flash('success', true)
            req.session.save(() => {
                res.redirect('/profile')
            })

        } catch (error) {
            console.error(error)
            req.flash('message', 'Erro ao cancelar plano premium.')
            req.flash('error', true)
            req.session.save(() => {
                res.redirect('/profile')
            })
        }
    }

    static async deletePremiumPost(req, res) {
        if (!req.session.userid) {
            req.flash('message', 'Acesso negado.')
            req.flash('error', true)
            return res.redirect('/login')
        }

        const postId = req.params.id

        try {
            const post = await PremiumPost.findOne({
                where: {
                    id: postId,
                    UserId: req.session.userid // Garante que o usuário só pode deletar seus próprios posts
                }
            })

            if (!post) {
                req.flash('message', 'Serviço não encontrado ou você não tem permissão para excluí-lo.')
                req.flash('error', true)
                return res.redirect('/profile')
            }

            // Opcional: deletar imagem do Cloudinary se existir
            // if (post.coverImage) {
            //     const publicId = post.coverImage.split('/').pop().split('.')[0];
            //     await cloudinary.uploader.destroy(publicId);
            // }

            await post.destroy()

            // Se o plano tiver um número limitado de posts e não for o master (posts fixos)
            const user = await User.findByPk(req.session.userid)
            if (user && user.isPremium && user.premiumPlan !== 'master') {
                user.premiumPostsRemaining++ // Retorna uma vaga
                await user.save()
            }

            req.flash('message', 'Serviço excluído com sucesso.')
            req.flash('success', true)
            req.session.save(() => {
                res.redirect('/profile')
            })

        } catch (error) {
            console.error(error)
            req.flash('message', 'Erro ao excluir serviço.')
            req.flash('error', true)
            req.session.save(() => {
                res.redirect('/profile')
            })
        }
    }
}
