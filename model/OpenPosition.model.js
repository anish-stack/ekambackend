const mongoose = require("mongoose");

const OpenPositionSchema = new mongoose.Schema({
  jobPosition: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  requirements: {
    subjects: [{
      type: String,
      required: true,
    }],
    qualifications: [{
      type: String,
      required: true,
    }],
  },
  benefits: {
    payment: {
      type: String,
      required: true,
    },
    workSchedule: {
      type: String,
      required: true,
    },
    support: {
      type: String,
      required: true,
    },
  },
  applicationProcess: {
    type: String,
    required: true,
  },
  aboutEkam: {
    type: String,
    default: "Ekam Innovations is dedicated to democratizing education. Over the last two decades, we've transformed into a premier online education platform, providing a personalized learning experience to over 30 million students, educators, and professionals monthly.\n\nOur mission is to empower learners worldwide to achieve their educational and career aspirations. We prioritize expanding educational access, recognizing information as the ultimate equalizer, and education as a catalyst for upward mobility.\n\nEkam Innovations is honored to be ranked 10th on Virtual Vocations' top 25 list of best partners for remote work in 2021. As we continue to grow, we actively expand our team of contractors to further our mission. Join us on this journey of innovation in education!"
  }
  
});

const OpenPosition = mongoose.model("OpenPosition", OpenPositionSchema);

module.exports = OpenPosition;
