const express = require('express')
const router = express.Router()
const EventosControllers = require('../controllers/EventosControllers')

router.get('/', EventosControllers.showEventos)
router.get('/farmacias', EventosControllers.showFarmacias)
router.get('/onibus', EventosControllers.showOnibus)
router.get('/outrosServicos', EventosControllers.showOutrosServicos)
router.get('/mercados', EventosControllers.showMercados)

module.exports = router