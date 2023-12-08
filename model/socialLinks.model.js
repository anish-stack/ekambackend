const mongoose = require("mongoose");

const SocialSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  links: {
    type: String, 
  },
});

const Social = mongoose.model("Social", SocialSchema);

module.exports = Social;
