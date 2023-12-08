const PurchaseModel = require('../model/Purchase.model');
const PdfBook = require('../model/pdfBooks.model');
const User = require('../model/user.model');
const Workshop = require('../model/workshop.model');
const AudioBook = require('../model/audioBooks.model');

exports.makePayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        // Check if the user has already purchased the product
        const existingPurchase = await PurchaseModel.findOne({
            user: userId,
            itemId: productId,
        });

        if (existingPurchase) {
            return res.status(400).json({ success: false, message: 'You have already purchased this product. Check your dashboard for details.' });
        }

        // Assuming that you have a PurchaseModel to store the purchases
        const purchase = new PurchaseModel({
            user: userId, // Set the user field to the user's ObjectId
        });

        let product;

        // Check if the product is a PdfBook
        product = await PdfBook.findById(productId);
        if (product) {
            purchase.itemType = 'PdfBook';
            purchase.itemId = product._id; // Set itemId to the PdfBook's ObjectId
            purchase.price = product.Price; // Set the price to the PdfBook's price
            // Handle PdfBook payment logic here
            await purchase.save();
            return res.status(200).json({ success: true, message: 'PdfBook purchase successful.' });
        }

        // Check if the product is a Workshop
        product = await Workshop.findById(productId);
        if (product) {
            purchase.itemType = 'Workshop';
            purchase.itemId = product._id; // Set itemId to the Workshop's ObjectId
            purchase.price = product.Price; // Set the price to the Workshop's price
            // Handle Workshop payment logic here
            await purchase.save();
            return res.status(200).json({ success: true, message: 'Workshop purchase successful.' });
        }

        // Check if the product is an AudioBook
        product = await AudioBook.findById(productId);
        if (product) {
            purchase.itemType = 'AudioBook';
            purchase.itemId = product._id; // Set itemId to the AudioBook's ObjectId
            purchase.price = product.Price; // Set the price to the AudioBook's price
            // Handle AudioBook payment logic here
            await purchase.save();
            return res.status(200).json({ success: true, message: 'AudioBook purchase successful.', product });
        }

        // If productId does not match any product type
        return res.status(404).json({ success: false, message: 'Product not found.' });
    } catch (error) {
        console.error('Error in makePayment:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


exports.getMakePyamentProductInfo =async(req,res)=>{

    try{

        const productId = req.params.productId;
        let product;

        // Check if the product is a PdfBook
        product = await PdfBook.findById(productId);
        if (product) {
    
            return res.status(200).json({ success: true, message: 'Product WFound successful.',product });
        }

        // Check if the product is a Workshop
        product = await Workshop.findById(productId);
        if (product) {

            return res.status(200).json({ success: true, message: 'Product WFound successful.',product });
        }

        // Check if the product is an AudioBook
        product = await AudioBook.findById(productId);
        if (product) {
            return res.status(200).json({ success: true, message: 'Product WFound successful.',product });

        }

        // If productId does not match any product type
        return res.status(404).json({ success: false, message: 'Product not found.' });
    } catch (error) {
        console.error('Error in makePayment:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};






