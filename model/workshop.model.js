const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema(
  {
    workshopName: {
      type: String,
      required: true,
    },
    TrainerName: {
      type: String,
      required: true,
    },
    SessionLink: {
      type: String,
    },
    WorkShopThmbnail:{
      type: String

    },
    Passcode: {
      type: String,
    },
    RecordSessionLink: {
      type: String,
    },
    certiFicateLink: {
      type: String,
    },
    WorkShopTitle: {
      type: String,
    },
    WorkShopDate: {
      type: String, 
    },
    DemoVideo: {
      type: String,
    },
    Price: {
      type: String,
    },
    DiscountPrice: {
      type: String,
    },
    Duration: {
      type: Number,
    },
    workShopType: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Workshop = mongoose.model("Workshop", workshopSchema);

module.exports = Workshop;
