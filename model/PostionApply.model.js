const mongoose = require("mongoose");

const OpenPositionApplySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  resumeLink: {
    type: String,
    required: true,
  },
  occupation:{
    type: String,
  }
});

const OpenPositionApply = mongoose.model("OpenPositionApply", OpenPositionApplySchema);

module.exports = OpenPositionApply;
