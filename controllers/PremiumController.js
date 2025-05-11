const User = require('../models/User')

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
} 