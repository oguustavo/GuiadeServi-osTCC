const Farmacia = require('../models/Farmacia')
const Mercado = require('../models/Mercado')
const Emprego = require('../models/Emprego')
const EventoCidade = require('../models/EventoCidade')

module.exports = class AdminControllers {
    static async dashboard(req, res) {
        // Verifica se o usuário é um administrador
        if (!req.session.isAdmin) {
            req.flash('message', 'Acesso negado');
            return res.redirect('/');
        }

        try {
            const [farmacias, estabelecimentos, vagas, eventos] = await Promise.all([
                Farmacia.findAll({ raw: true }),
                Mercado.findAll({ raw: true }),
                Emprego.findAll({ raw: true }),
                EventoCidade.findAll({ raw: true })
            ]);

            res.render('admin/dashboard', { 
                farmacias,
                estabelecimentos,
                vagas,
                eventos
            });
        } catch (error) {
            console.log(error)
            res.status(500).send('Erro ao carregar dashboard')
        }
    }
}