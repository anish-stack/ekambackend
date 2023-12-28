const express = require('express')
const { protect } = require('../middleware/auth')
const { createWorkshop,updateWorkshop,deleteWorkshop,getWorkshops,makeAudioFiles,updateAudioBook,deleteAudioBooks,getSingleWorkShop,getAudioFiles,FreedownloadAudioBooks,getWorkShopByTrainerNameAndTitle,createReview, getSingleAudioFiles,getworkshopReview, registerForFreeSeminar } = require('../controllers/workshopcontroller')
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
const router = express.Router()
const path= require('path');
const { genToken,createPayment } = require('../controllers/paymentController');
const { makepdfFiles, getPdfFiles, updatepdfBook, deletePdfBooks, FreedownloadPdfBooks } = require('../controllers/pdfController');

router.post('/create-workshop',protect,createWorkshop)
router.put("/update-workshops/:id",protect,updateWorkshop)
router.delete("/delete-workshops/:id",protect,deleteWorkshop)
router.post('/get-workshop',getWorkshops)
router.post('/create-audiobooks',protect,makeAudioFiles)
router.put('/update-audiobooks/:audioBookId', protect,updateAudioBook);
router.delete('/delete-audiobooks/:audioBookId', protect,deleteAudioBooks);
router.get('/download/:audioBookId', FreedownloadAudioBooks);
router.get('/get-single-audiobook/:AudioId', getSingleAudioFiles);
router.get('/workshops/search', getWorkShopByTrainerNameAndTitle)
router.post("/workshops/:workshopId",protect,createReview)
router.get("/workshop/:workshopId",getworkshopReview)

router.get('/workshops/:workshopId',getSingleWorkShop)

router.get('/getAudioFiles',getAudioFiles)



router.post('/create-pdfbooks',protect,makepdfFiles)
router.put('/update-pdfbooks/:PdfBookId', protect,updatepdfBook);
router.delete('/delete-pdfbooks/:PdfBookId', protect,deletePdfBooks);
router.get('/download-pdf/:PdfBookId', FreedownloadPdfBooks);
router.get('/getpdfFiles',getPdfFiles)




router.get('/pay', genToken)
router.post('/registerFreeSeminar/:SeminarId',registerForFreeSeminar)

module.exports=router
