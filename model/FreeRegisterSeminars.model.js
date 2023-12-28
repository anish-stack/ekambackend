const mongoose = require("mongoose");

const FreeSeminarSchema = new mongoose.Schema({
  Name: {
    type: String,
    required:true

  },
  Email: {
    type: String,
    required:true
  },
  occupation:{
    type :String,
   

  },
  contactNumber: {
    type: Number,
    required:true
  },

  schoolName:{
    type: String,
    required:true,

  },
  SeminarId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Workshop"
  }

});

const Seminar = mongoose.model("FreeSeminar", FreeSeminarSchema);

module.exports = Seminar;
