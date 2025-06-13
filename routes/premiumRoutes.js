const express = require('express')
const router = express.Router()
const PremiumController = require('../controllers/PremiumController')
const { upload } = require('../config/cloudinary')

router.get('/premium', PremiumController.showPremiumPage)
router.get('/premium/subscribe/:planType', PremiumController.showPaymentPage)
router.post('/premium/process-payment', PremiumController.processPayment)
router.get('/premium/post-form', PremiumController.showPostForm)
router.post('/premium/create-post', upload.single('coverImage'), PremiumController.createPost)

router.get('/profile', PremiumController.showProfilePage)
router.post('/profile/cancel-premium', PremiumController.cancelPremium)
router.post('/profile/delete-post/:id', PremiumController.deletePremiumPost)

module.exports = router 