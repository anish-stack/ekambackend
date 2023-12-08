const express = require('express')
const { signup, activateAccount, signin, logout, PasswordChange,getMyPurchase,contactForm } = require('../controllers/usercontroller')
const { protect } = require('../middleware/auth')
const { makePayment,getMakePyamentProductInfo } = require('../controllers/demoPaymentController')
const router = express.Router()

router.post('/SignUp',signup)
router.get('/activate',activateAccount)
router.post('/signIn',signin)
router.post('/logout',protect,logout)
router.post('/change-password',PasswordChange)
router.get('/getmyStuff',protect,getMyPurchase)
router.get("/getMakePyamentProductInfo/:productId",getMakePyamentProductInfo)
router.get('/payment/do-for-paid/:productId',protect,makePayment)
router.post('/Contact',contactForm)


module.exports=router
