const express = require('express');
const router = express.Router();
const AdminControllers = require('../controllers/AdminControllers');

// Rota para o dashboard de administração
router.get('/dashboard', AdminControllers.dashboard);

module.exports = router; 