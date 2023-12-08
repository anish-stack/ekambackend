const PdfBook = require("../model/pdfBooks.model");
const axios = require('axios');

exports.makepdfFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const {
      title,
      PdfLinks,
      isPaid,
      price,
      DiscountPrice,
      PdfBookThumbnail,
      bookDescription,
    } = req.body;

    // Validation
    const missingFields = [];

    if (!title) missingFields.push("title");
    if (!PdfLinks) missingFields.push("PdfLinks");
    if (!price) missingFields.push("price");
    if (!PdfBookThumbnail) missingFields.push("PdfBookThumbnail");
    if (!bookDescription) missingFields.push("bookDescription");

    if (missingFields.length > 0) {
      return res.status(400).json({
        msg: `Please provide all required fields. Missing: ${missingFields.join(", ")}`,
      });
    }

    // Create a new PdfBook instance
    const newAudioBook = new PdfBook({
      title,
      PdfLinks,
      isPaid,
      price,
      DiscountPrice,
      PdfBookThumbnail,
      bookDescription,
      user: userId,
    });

    // Save the new PdfBook
    await newAudioBook.save();

    // Return success response
    res.status(201).json({ msg: "PdfBook created successfully.", PdfBook: newAudioBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.getPdfFiles = async (req, res) => {
  try {
    // Fetch all Pdf books
    const PdfBooks = await PdfBook.find();

    // If no Pdf books are found, return an empty array
    if (!PdfBooks || PdfBooks.length === 0) {
      return res.status(404).json({ msg: "No Pdf books found." });
    }

    // Return the list of Pdf files
    res.status(200).json({ PdfBooks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.updatepdfBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const PdfBookId = req.params.PdfBooksId; // Assuming you have the PdfBookId in the route parameter
    const { title, PdfLinks, isPaid, price, discountPrice, PdfBookThumbnail, bookDescription } = req.body;

    // Validation: Check if the user is authorized to update the Pdf book
    if (!userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Additional validation based on your requirements

    // Find the Pdf book by ID and update it
    const updatedPdfBook = await PdfBook.findByIdAndUpdate(
      PdfBookId,
      {
        title,
        PdfLinks,
        isPaid,
        price,
        discountPrice,
        PdfBookThumbnail,
        bookDescription,
        user: userId,
      },
      { new: true } // Return the updated document
    );

    if (!updatedPdfBook) {
      return res.status(404).json({ msg: "AudioBook not found" });
    }

    // Return success response
    res.json({ msg: "PdfBook updated successfully", PdfBook: updatedPdfBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deletePdfBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const PdfBookId = req.params.PdfBookId; // Assuming you have the PdfBookId in the route parameter

    // Validation: Check if the user is authorized to delete the Pdf book
    if (!userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Find the Pdf book by ID and delete it
    const deletedpdfBook = await PdfBook.findByIdAndDelete(PdfBookId);

    if (!deletedpdfBook) {
      return res.status(404).json({ msg: "AudioBook not found" });
    }

    // Return success response
    res.json({ msg: "AudioBook deleted successfully", PdfBook: deletedpdfBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.FreedownloadPdfBooks = async (req, res) => {
  try {
    const PdfBookId = req.params.PdfBookId; // Replace with the actual Pdf book ID
    console.log(PdfBookId)
    // Find the Pdf book by ID
    const PdfBooks = await PdfBook.findById(PdfBookId);

    if (!PdfBooks) {
      return res.status(404).json({ msg: "PdfBook not found" });
    }

    // Check if the Pdf book is paid
    if (PdfBooks.isPaid) {
      return res.redirect(`http://localhost:3000/Paid/${PdfBookId}`);
    }

    // Find the requested Pdf links in the Pdf book's links
    const PdfLinks = PdfBooks.PdfLinks;
    if (!PdfLinks || PdfLinks.length === 0) {
      return res.status(404).json({ msg: "No Pdf links found" });
    }

    // Update the download count in the database
    // Set the filename based on the Pdf Book title and link
    const filename = `${PdfBooks.title}_${PdfLinks.indexOf(PdfLinks) + 1}.pdf`;

    // Stream the file from the remote server to the response
    const response = await axios({
      method: 'get',
      url: PdfLinks,
      responseType: 'stream',
    });

    // Set Content-Disposition header with the dynamic filename
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    response.data.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
