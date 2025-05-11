const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/ContactController');

// Rota para exibir a página de contato
router.get('/', ContactController.showContactPage);

// Rota para processar o envio do formulário de contato (você pode implementar isso depois)
router.post('/send', ContactController.sendEmail);

module.exports = router; 