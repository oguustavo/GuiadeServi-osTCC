const express = require('express')
const router = express.Router()
const PremiumController = require('../controllers/PremiumController')

router.get('/premium', PremiumController.showPremiumPage)

module.exports = router 