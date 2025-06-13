const User = require('../models/User')
const PremiumPost = require('../models/PremiumPost')

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
            res.redirect('/eventos/outrosServicos')
        } catch (error) {
            console.error(error)
            req.flash('message', 'Erro ao processar pagamento')
            req.flash('error', true)
            res.redirect('/premium')
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
            const { title, whatsappLink, workType } = req.body
            const coverImage = req.file ? req.file.path : null

            const post = await PremiumPost.create({
                title,
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
            res.redirect('/eventos/outrosServicos')
        } catch (error) {
            console.error(error)
            req.flash('message', 'Erro ao criar post')
            req.flash('error', true)
            res.redirect('/premium/post-form')
        }
    }
} 