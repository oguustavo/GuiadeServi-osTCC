const express = require('express');
const router = express.Router();
const AdminControllers = require('../controllers/AdminControllers');
const EventosControllers = require('../controllers/EventosControllers');
const { upload } = require('../config/cloudinary');

// Rota para o dashboard de administração
router.get('/dashboard', AdminControllers.dashboard);

router.post('/eventos/create', upload.single('imagem'), EventosControllers.createEvento);
router.post('/eventos/delete', upload.none(), EventosControllers.deleteEvento);

module.exports = router;