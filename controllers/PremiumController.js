const User = require('../models/User')
const PremiumPost = require('../models/PremiumPost')
const { Op } = require('sequelize')

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
}

module.exports = class PremiumController {
    static async showPremiumPage(req, res) {
        if (!req.session.userid) {
            req.flash('message', 'Faça login ou cadastre-se para acessar os recursos premium')
            req.flash('info', true)
            res.render('premium/premium', { 
                notLogged: true,
                message: 'Faça o registro agora para acessar a opção de ser premium!'
            })
            return
        }

        res.render('premium/premium', { 
            notLogged: false
        })
    }

    static async showPaymentPage(req, res) {
        const planType = req.params.planType
        const planDetails = PLAN_DETAILS[planType]

        if (!planDetails) {
            req.flash('message', 'Plano inválido')
            req.flash('error', true)
            return res.redirect('/premium')
        }

        res.render('premium/payment', {
            planType,
            planName: planDetails.name,
            planPrice: planDetails.price,
            planDescription: planDetails.description
        })
    }

    static async processPayment(req, res) {
        const planType = req.body.planType
        const planDetails = PLAN_DETAILS[planType]

        if (!planDetails) {
            req.flash('message', 'Plano inválido')
            req.flash('error', true)
            return res.redirect('/premium')
        }

        try {
            const user = await User.findByPk(req.session.userid)
            
            // Set premium status
            user.isPremium = true
            user.premiumPlan = planType
            user.premiumExpiresAt = new Date(Date.now() + (planDetails.daysValid * 24 * 60 * 60 * 1000))
            user.premiumPostsRemaining = planDetails.postsAllowed
            
            await user.save()

            req.flash('message', 'Pagamento processado com sucesso! Agora você é um usuário premium.')
            req.flash('success', true)
            req.session.save(() => {
                res.redirect('/eventos/outrosServicos')
            })
        } catch (error) {
            console.error(error)
            req.flash('message', 'Erro ao processar pagamento')
            req.flash('error', true)
            req.session.save(() => {
                res.redirect('/premium')
            })
        }
    }

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