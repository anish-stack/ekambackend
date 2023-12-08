const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
    },
    isActive: {
      type: Boolean,
      default:false
    },
    role:{
      type:String,
      enum:["Student","Instructor","Admin"],
      default:"Student"
    },
    Designiation:{
        type:String,
    },

    ActivationToken: {
      token: String,
    },
    resetEmailTokenTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

// hash the password
userschema.pre("save", async function (next) {
  const user = this;

  // If the password is not modified, move on to the next middleware
  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    // Call next to proceed to the next middleware or the save operation
    next();
  } catch (error) {
    // Pass the error to the next middleware or the save operation
    return next(error);
  }
});
//// Add the method to compare passwords

userschema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userschema.methods.getJwtToken = function () {
  const token = jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "4d",
    }
  );
  return token;
};


const User = mongoose.model("User", userschema);

module.exports = User;
