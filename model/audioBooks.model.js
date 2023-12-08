const mongoose = require('mongoose')

const audioBooksSchema = new mongoose.Schema({

    title: { 
        type: String,
         },
  
    audioLinks:{
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
    audioBookThumbnail:{
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


const AudioBook = mongoose.model("AudioBook", audioBooksSchema);

module.exports = AudioBook;