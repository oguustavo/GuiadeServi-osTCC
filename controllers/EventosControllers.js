const Evento = require('../models/Evento')
const User = require('../models/User')

module.exports = class EventosControllers {
    static async showEventos(req, res) {
        res.render('eventos/home', {
            user: req.user || null  // Passa o usuário para a view
        })
    }

    static async showFarmacias(req, res) {
        try {
            const farmacias = await Evento.findAll({
                where: {
                    tipo: 'farmacia'
                },
                raw: true
            })
            console.log('Farmácias encontradas:', farmacias) // Para debug
            res.render('eventos/farmacias', { farmacias })
        } catch (error) {
            console.log(error)
            res.status(500).send('Erro ao buscar farmácias')
        }
    }

    static async createEvento(req, res) {
        try {
            const { nome, endereco, telefone, dataInicio, dataFim } = req.body
            await Evento.create({
                nome,
                endereco,
                telefone,
                dataInicio,
                dataFim,
                tipo: 'farmacia'
            })
            req.flash('success', 'Farmácia cadastrada com sucesso!')
            res.redirect('/admin/dashboard')
        } catch (error) {
            console.log(error)
            res.status(500).send('Erro ao cadastrar farmácia')
        }
    }

    static async deleteEvento(req, res) {
        try {
            const { id } = req.body
            await Evento.destroy({ where: { id } })
            req.flash('success', 'Farmácia removida com sucesso!')
            res.redirect('/admin/dashboard')
        } catch (error) {
            console.log(error)
            res.status(500).send('Erro ao excluir farmácia')
        }
    }
}