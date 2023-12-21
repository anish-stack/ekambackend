const express = require('express')
const { signup, activateAccount, signin, logout, PasswordChange,getMyPurchase,contactForm } = require('../controllers/usercontroller')
const { protect } = require('../middleware/auth')
const { makePayment,getMakePyamentProductInfo,getAllPayments } = require('../controllers/demoPaymentController')
const { createPosition, getPostion, getSinglePostion, ApplyForJobPostion } = require('../controllers/PostionController')
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
router.get('/payments', getAllPayments);
router.post('/Post-Position',createPosition)
router.get('/get-Position',getPostion)
router.get('/get-Position/:positionId',getSinglePostion)
router.post('/Apply-job',ApplyForJobPostion)

module.exports=router
