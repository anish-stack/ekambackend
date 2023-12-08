const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
    price: {
        type: String,
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    itemType: {
        type: String,
        enum: ['PdfBook', 'Workshop', 'AudioBook'],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true }); 

const Purchase = mongoose.model("Purchase", PurchaseSchema);

module.exports = Purchase;
