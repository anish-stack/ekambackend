const mongoose = require("mongoose");

const Ratings = new mongoose.Schema(
  {
    
    Rating:{
        type:Number
    },

    Review:{
        type:String,
    },

    workshopId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workshop",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const RatingSchema = mongoose.model("Rating", Ratings);

module.exports = RatingSchema;
