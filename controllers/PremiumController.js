const User = require('../models/User')

module.exports = class PremiumController {
    static async showPremiumPage(req, res) {
        if (!req.session.userid) {
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