const mongoose = require('mongoose')

const pdfBooksSchema = new mongoose.Schema({

    title: { 
        type: String,
         },
  
    PdfLinks:{
        type: [String],
         required: true
    },
    isPaid:{
        type: Boolean,
        default:false
    },
    Price:{
        type: String,
    },
    DiscountPrice:{
        type:String
    },
    PdfBookThumbnail:{
        type: String,
        required:true
    },
    bookDescription:{
        type: String
    },
    downloads: { type: Number, default: 0 },
    user:{
        type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
})


const pdfBook = mongoose.model("pdfBook", pdfBooksSchema);

module.exports = pdfBook;