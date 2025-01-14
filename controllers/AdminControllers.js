const Evento = require('../models/Evento')

module.exports = class AdminControllers {
    static async dashboard(req, res) {
        // Verifica se o usuário é um administrador
        if (!req.session.isAdmin) {
            req.flash('message', 'Acesso negado');
            return res.redirect('/');
        }

        try {
            const eventos = await Evento.findAll({
                where: {
                    tipo: 'farmacia'
                },
                raw: true
            })
            res.render('admin/dashboard', { eventos })
        } catch (error) {
            console.log(error)
            res.status(500).send('Erro ao carregar dashboard')
        }
    }
}