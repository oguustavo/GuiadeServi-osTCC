const Evento = require('../models/Evento')

module.exports = class AdminControllers {
    static async dashboard(req, res) {
        // Verifica se o usuário é um administrador
        if (!req.session.isAdmin) {
            req.flash('message', 'Acesso negado');
            return res.redirect('/');
        }

        try {
            const [farmacias, estabelecimentos, vagas] = await Promise.all([
                Evento.findAll({
                    where: { tipo: 'farmacia' },
                    raw: true
                }),
                Evento.findAll({
                    where: { tipo: 'estabelecimento' },
                    raw: true
                }),
                Evento.findAll({
                    where: { tipo: 'vaga' },
                    raw: true
                })
            ]);

            res.render('admin/dashboard', { 
                farmacias,
                estabelecimentos,
                vagas
            });
        } catch (error) {
            console.log(error)
            res.status(500).send('Erro ao carregar dashboard')
        }
    }
}