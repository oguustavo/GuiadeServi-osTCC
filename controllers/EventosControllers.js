const Evento = require('../models/Evento')
const User = require('../models/User')

module.exports = class EventosControllers {
    static async showEventos(req, res) {
        res.render('eventos/home')
    }

    static async showFarmacias(req, res) {
        const farmacias = [
            { name: 'Farmácia A', description: 'Descrição A', address: 'Endereço A', image: 'https://via.placeholder.com/150' },
            { name: 'Farmácia B', description: 'Descrição B', address: 'Endereço B', image: 'https://via.placeholder.com/150' },
            // Adicione mais farmácias conforme necessário
        ];
        res.render('eventos/farmacias', { farmacias });
    }
}