const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  img: {
    type: String, 
  },
});

const Gallery = mongoose.model("Gallery", GallerySchema);

module.exports = Gallery;
