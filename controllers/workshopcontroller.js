const Workshop = require("../model/workshop.model")
const AudioBook  = require("../model/audioBooks.model")
const ratings = require("../model/rating&reviews.model")

const axios = require('axios');
// Create workshop

exports.createWorkshop = async (req, res) => {
    try {
      // Step 1: Extract data from the request body
      const userId = req.user.id;
      console.log(userId);

      const {
        workshopName,
        TrainerName,
        SessionLink,
        Passcode,
        RecordSessionLink,
        certiFicateLink,
        WorkShopTitle,
        WorkShopDate,
        DemoVideo,
        WorkShopThmbnail,
        Price,
        DiscountPrice,
        Duration,
        workShopType,
        user
      } = req.body;
  
      if(!userId){
        return res.status(403).json({msg:"Unauthorized"})
      }


      // Step 2: Create a new workshop instance
      const newWorkshop = new Workshop({
        workshopName,
        TrainerName,
        SessionLink,
        Passcode,
        RecordSessionLink,
        certiFicateLink,
        WorkShopTitle,
        WorkShopDate,
        DemoVideo,
        WorkShopThmbnail,
        Price,
        DiscountPrice,
        Duration,
        workShopType,
        user:userId
      });
  
      // Step 3: Save the workshop to the database
      await newWorkshop.save();
  
      // Step 4: Respond with a success message
      return res.status(201).json({
        success: true,
        message: "Workshop created successfully",
        workshop: newWorkshop,
      });
    } catch (error) {
      // Step 5: Handle any errors that might occur during the process
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
};

// Update workshop
exports.updateWorkshop = async (req, res) => {
  try {
    // Step 1: Extract data from the request body
    const {
      workshopName,
      TrainerName,
      SessionLink,
      Passcode,
      RecordSessionLink,
      WorkShopThmbnail,
      certiFicateLink,
      WorkShopTitle,
      WorkShopDate,
      DemoVideo,
      Price,
      DiscountPrice,
      Duration,
      workShopType,
    } = req.body;

    // Step 2: Get the user ID from the protected route middleware
    const userId = req.user.id;

    // Step 3: Find the workshop by ID
    const workshopId = req.params.id; 
    const workshop = await Workshop.findById(workshopId);

    // Step 4: Check if the workshop exists
    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found',
      });
    }

    // Step 5: Check if the user is authorized to update the workshop
    if (workshop.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this workshop',
      });
    }

    // Step 6: Update the workshop fields
    workshop.workshopName = workshopName || workshop.workshopName;
    workshop.TrainerName = TrainerName || workshop.TrainerName;
    workshop.SessionLink = SessionLink || workshop.SessionLink;
    workshop.Passcode = Passcode || workshop.Passcode;
    workshop.RecordSessionLink = RecordSessionLink || workshop.RecordSessionLink;
    workshop.certiFicateLink = certiFicateLink || workshop.certiFicateLink;
    workshop.WorkShopTitle = WorkShopTitle || workshop.WorkShopTitle;
    workshop.WorkShopDate = WorkShopDate || workshop.WorkShopDate;
    workshop.DemoVideo = DemoVideo || workshop.DemoVideo;
    workshop.Price = Price || workshop.Price;
    workshop.DiscountPrice = DiscountPrice || workshop.DiscountPrice;
    workshop.Duration = Duration || workshop.Duration;
    workshop.workShopType = workShopType || workshop.workShopType;
    workshop.WorkShopThmbnail = WorkShopThmbnail || workshop.WorkShopThmbnail;

    // Step 7: Save the updated workshop to the database
    await workshop.save();

    // Step 8: Respond with a success message
    return res.status(200).json({
      success: true,
      message: 'Workshop updated successfully',
      workshop,
    });
  } catch (error) {
    // Step 9: Handle any errors that might occur during the process
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete workshop
exports.deleteWorkshop = async (req, res) => {
  try {
    // Step 1: Get the user ID from the protected route middleware
    const userId = req.user._id;

    // Step 2: Find the workshop by ID
    const workshopId = req.params.id;
    const workshop = await Workshop.findById(workshopId);

    // Step 3: Check if the workshop exists
    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found',
      });
    }

    await workshop.deleteOne();

    // Step 6: Respond with a success message
    return res.status(200).json({
      success: true,
      message: 'Workshop deleted successfully',
    });
  } catch (error) {
    // Step 7: Handle any errors that might occur during the process
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    // Step 1: Extract data from the request body
    const userId = req.user.id;
    const workshopId = req.params.workshopId; // Assuming the workshopId is part of the route parameters
    const { Rating, Review } = req.body;
    // Step 2: Validate input

    if (!userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Step 2: Create a new rating instance
    const newRating = new ratings({
      Rating,
      Review,
      workshopId,
      user: userId,
    });

    // Step 3: Save the rating to the database
    await newRating.save();

    // Step 4: Respond with a success message
    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      rating: newRating,
    });
  } catch (error) {
    // Step 5: Handle any errors that might occur during the process
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getworkshopReview = async (req, res) => {
  try {
    const workshopId = req.params.workshopId;

    // Step 1: Validate if the workshopId is provided
    if (!workshopId) {
      return res.status(400).json({ success: false, message: 'Workshop ID is required' });
    }

    // Step 2: Find reviews for the specified workshopId
    const workshopReviews = await ratings.find({ workshopId });

    // Step 3: Check if there are reviews for the workshop
    if (!workshopReviews || workshopReviews.length === 0) {
      return res.status(404).json({ success: false, message: 'No reviews found for the workshop' });
    }

    // Step 4: Respond with the workshop reviews
    return res.status(200).json({ success: true, workshopReviews });
  } catch (error) {
    // Step 5: Handle any errors that might occur during the process
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//get All Workshop
exports.getWorkshops = async (req, res) => {
  try {
    // Step 1: Get all workshops from the database
    const workshops = await Workshop.find();

    // Step 2: Respond with the list of workshops
    return res.status(200).json({
      success: true,
      workshops,
    });
  } catch (error) {
    // Step 3: Handle any errors that might occur during the process
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

exports.getSingleWorkShop = async (req, res) => {
  try {
    const workshopId = req.params.workshopId;

    // Use findById to find a workshop by its ID
    const workshop = await Workshop.findById(workshopId);

    // Check if the workshop exists
    if (!workshop) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }

    // If the workshop exists, respond with the workshop data
    return res.status(200).json({ success: true, workshop });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
exports.getWorkShopByTrainerNameAndTitle = async (req, res) => {
  try {
    const { query } = req;

    if (!query.trainerName && !query.workshopTitle) {
      return res.status(400).json({ message: 'Please provide at least one search parameter.' });
    }

    // Create an array of words to search for
    const searchWords = [];
    if (query.trainerName) {
      searchWords.push(...query.trainerName.split(/\s+/));
    }
    if (query.workshopTitle) {
      searchWords.push(...query.workshopTitle.split(/\s+/));
    }

    // Perform a case-insensitive search using regular expressions
    const workshops = await Workshop.find({
      $or: [
        { TrainerName: { $in: searchWords.map(word => new RegExp(word, 'i')) } },
        { WorkShopTitle: { $in: searchWords.map(word => new RegExp(word, 'i')) } },
      ],
    });

    if (workshops.length === 0) {
      return res.status(404).json({ message: 'No workshops found.' });
    }

    return res.status(200).json(workshops);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};






exports.makeAudioFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const {
      title,
      audioLinks,
      isPaid,
      price,
      DiscountPrice,
      audioBookThumbnail,
      bookDescription,
    } = req.body;

    // Validation
    const missingFields = [];

    if (!title) missingFields.push("title");
    if (!audioLinks) missingFields.push("audioLinks");
    if (!price) missingFields.push("price");
    if (!audioBookThumbnail) missingFields.push("audioBookThumbnail");
    if (!bookDescription) missingFields.push("bookDescription");

    if (missingFields.length > 0) {
      return res.status(400).json({
        msg: `Please provide all required fields. Missing: ${missingFields.join(", ")}`,
      });
    }

    // Create a new AudioBook instance
    const newAudioBook = new AudioBook({
      title,
      audioLinks,
      isPaid,
      price,
      DiscountPrice,
      audioBookThumbnail,
      bookDescription,
      user: userId,
    });

    // Save the new AudioBook
    await newAudioBook.save();

    // Return success response
    res.status(201).json({ msg: "AudioBook created successfully.", audioBook: newAudioBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.getSingleAudioFiles = async (req, res) => {
  try {
    const AudioId = req.params.AudioId;
    console.log()
    // Use findById to find a workshop by its ID
    const AudioBooks = await AudioBook.findById(AudioId);

    // Check if the workshop exists
    if (!AudioBooks) {
      return res.status(404).json({ success: false, message: "AudioBooks not found" });
    }

    // If the workshop exists, respond with the workshop data
    return res.status(200).json({ success: true, AudioBooks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
exports.getAudioFiles = async (req, res) => {
  try {
    // Fetch all audio books
    const audioBooks = await AudioBook.find();

    // If no audio books are found, return an empty array
    if (!audioBooks || audioBooks.length === 0) {
      return res.status(404).json({ msg: "No audio books found." });
    }


    // Return the list of audio files
    res.status(200).json({ audioBooks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
exports.updateAudioBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const audioBookId = req.params.audioBookId; // Assuming you have the audioBookId in the route parameter
    const { title, audioLinks, isPaid, price, discountPrice, audioBookThumbnail, bookDescription } = req.body;

    // Validation: Check if the user is authorized to update the audio book
    if (!userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }


    // Additional validation based on your requirements

    // Find the audio book by ID and update it
    const updatedAudioBook = await AudioBook.findByIdAndUpdate(
      audioBookId,
      {
        title,
        audioLinks,
        isPaid,
        price,
        discountPrice,
        audioBookThumbnail,
        bookDescription,
        user: userId,
      },
      { new: true } // Return the updated document
    );

    if (!updatedAudioBook) {
      return res.status(404).json({ msg: "AudioBook not found" });
    }

    // Return success response
    res.json({ msg: "AudioBook updated successfully", audioBook: updatedAudioBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteAudioBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const audioBookId = req.params.audioBookId; // Assuming you have the audioBookId in the route parameter

    // Validation: Check if the user is authorized to delete the audio book
    if (!userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Find the audio book by ID and delete it
    const deletedAudioBook = await AudioBook.findByIdAndDelete(audioBookId);

    if (!deletedAudioBook) {
      return res.status(404).json({ msg: "AudioBook not found" });
    }

    // Return success response
    res.json({ msg: "AudioBook deleted successfully", audioBook: deletedAudioBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


exports.FreedownloadAudioBooks = async (req, res) => {
  try {
    const audioBookId = req.params.audioBookId; // Replace with the actual audio book ID

    // Find the audio book by ID
    const audioBook = await AudioBook.findById(audioBookId);

    if (!audioBook) {
      return res.status(404).json({ msg: "AudioBook not found" });
    }

    // Check if the audio book is paid
    if (audioBook.isPaid) {
      return res.redirect(`https://ekamfront.vercel.app/Paid/${audioBookId}`);
    }

    // Find the requested audio links in the audio book's links
    const audioLinks = audioBook.audioLinks;
    if (!audioLinks || audioLinks.length === 0) {
      return res.status(404).json({ msg: "No audio links found" });
    }

    // Update the download count in the database
    audioBook.downloads = (audioBook.downloads || 0) + 1;
    await audioBook.save();

    // Loop through each audio link and download
    for (const audioLink of audioLinks) {
      // Set the filename based on the audioBook title and link
      const filename = `${audioBook.title}_${audioLinks.indexOf(audioLink) + 1}.mp3`;

      // Stream the file from the remote server to the response
      const response = await axios({
        method: 'get',
        url: audioLink,
        responseType: 'stream',
      });

      // Set Content-Disposition header with the dynamic filename
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      response.data.pipe(res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


