const express = require('express');
const router = express.Router();
const AdminControllers = require('../controllers/AdminControllers');
const EventosControllers = require('../controllers/EventosControllers');

// Rota para o dashboard de administração
router.get('/dashboard', AdminControllers.dashboard);

router.post('/eventos/create', EventosControllers.createEvento);
router.post('/eventos/delete', EventosControllers.deleteEvento);

module.exports = router;