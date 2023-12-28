const sendtoken = require('../utils/sendtoken')
const sendEmail = require('../utils/sendMail')
const User = require('../model/user.model')
const bcrypt = require("bcrypt");
const Contact = require("../model/contact.model")
const PurchaseModel = require('../model/Purchase.model');

const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
//verification
async function verificationLink(token, email, isActivate, resetTime) {
    try {
      const user = await User.findOne({ email, 'ActivationToken.token': token});
  
      if (!user) {
        // User not found with the provided email and token
        return false;
      }
  
      // Activate the account
      if (isActivate) {
        user.isActive = true;
        user.ActivationToken = undefined; // Clear the activation token
      }
  
      // Set the reset email token time
      if (resetTime) {
        user.resetEmailTokenTime = resetTime;
      }
  
      // Save the user changes
      await user.save();
  
      return true;
    } catch (error) {
      console.error(error);
      // Handle errors
      return false;
    }
  }

  exports.signup = async (req, res) => {
    try {
      const { username, email, password, Designiation } = req.body;
  
      // Validate all fields
      if (!username || !email || !password || !Designiation) {
        return res.status(400).json({
          success: false,
          message: 'Please fill all blanks',
        });
      }
  
      // Generate activation link
      const activationToken = uuidv4();
  
      // Create a new user
      const newUser = new User({
        username,
        email,
        password, // Make sure to hash the password before saving it
        Designiation,
        ActivationToken: { token: activationToken },
      });
  
      try {
        // Save the user to the database
  
        // You can send the activation link in the response or via email to the user
        const activationLink = `http://localhost:4000/api/v1/activate?token=${activationToken}&email=${encodeURIComponent(email)}`;

        const options = {
          email,
          subject: "Activate Your Account",
         message:`<!DOCTYPE html>
         <html lang="en">
         <head>
           <meta charset="UTF-8">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Ekam Innovations</title>
           <style>
             body {
               font-family: 'Arial', sans-serif;
               background-color: #f4f4f4;
               margin: 0;
               padding: 20px;
             }
         
             .email-container {
               max-width: 600px;
               margin: 0 auto;
               background-color: #fff;
               padding: 20px;
               border-radius: 10px;
               background: rgba(255, 255, 255, 0.2);
               border-radius: 16px;
               box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
               backdrop-filter: blur(5px);
               -webkit-backdrop-filter: blur(5px);
               border: 1px solid rgba(255, 255, 255, 0.3);
             }
         
             h1 {
               color: #007bff;
               text-align:center;
             }
         
             p {
               color: #333;
             }
         
               .button-container {
                             text-align: center;
                             margin-top: 20px;
                         }
                         
                         .btn {
                             display: inline-block;
                             padding: 10px 20px;
                             background-color: #6835f3;
                             color: #fff;
                             text-decoration: none;
                             border-radius: 5px;
                             cursor: pointer;
                             transition: background-color 0.3s ease;
                         }
                         
                         .btn:hover {
                             background-color: #0056b3;
                         }
                         a{
                             color: #fff!important;
                         }
                         
                         /* Additional styles for older versions of Internet Explorer */
                         .btn {
                             /* For IE 11 */
                             display: -ms-inline-flexbox;
                             -ms-inline-flex-align: center;
                             -ms-inline-flex-pack: center;
                         
                             /* For IE 10 */
                             display: -webkit-inline-box;
                             -webkit-box-align: center;
                             -webkit-box-pack: center;
                         
                             /* For IE 9 */
                             display: inline-block;
                             *zoom: 1;
                             *display: inline;
                         }
                         .btn {
                             mso-line-height-rule: exactly;
                             display: inline-block;
                             text-align: center;
                             mso-hide: all;
                         }
                         
                     
         
             .signature {
               margin-top: 20px;
               font-style: italic;
             }
             .logo {
           width: 100%;
           height: auto;
           max-width: 100%;
           -ms-interpolation-mode: bicubic; /* IE8 support */
         }
         
         .email-container img {
           max-width: 100%;
           height: auto;
           display: block; /* Ensures the image is centered */
           margin: 0 auto; /* Centers the image */
         }
         
             .footer {
               margin-top: 40px;
               padding-top: 20px;
               border-top: 1px solid #ccc;
               text-align: center;
             }
            .footer a {
           color: #000!important;
         }
         
             .logo {
               max-width: 100%;
               height: auto;
               margin-bottom: 20px;
             }
           </style>
         </head>
         <body>
           <div class="email-container">
             <img class="logo" src="https://i.postimg.cc/MH9R2XLM/ekam-innocations-high-resolution-logo-black-removebg-preview.png" alt="Ekam Innovations Logo">
         
             <h1>Welcome to Ekam Innocations! 🌟</h1>
             <p>
               At Ekam Innovations, we believe in the power of innovating education and educating innovations to shape lives and nurture future leaders. 📚✨
               We operate in three fundamental directions, each dedicated to fostering growth, innovation, and excellence in education. 🌐
             </p>
         
             <p>
               Congratulations on signing up, ${username}! Your journey with Ekam Innocations is about to begin. 🚀
             </p>
         
             <p>
               To activate your account, please click the button below:
             </p>
         
             <div class="button-container">
               <a href="${activationLink}" class="btn">Activate Account 🔐</a>
             </div>
         
             <p class="signature">
               Best regards,<br>
               The Ekam Innocations Team 🌈
             </p>
           </div>
         
     
         </body>
         </html>
         `
        };
        
        console.log(activationLink)
        // Send the activation email
        await sendEmail(options);
        await newUser.save();

        return res.status(201).json({
          success: true,
          message: 'Registration successful! Please Confirm Email Id',
          activationLink,
        });
  
      } catch (error) {
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map((err) => err.message);
          return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: validationErrors,
          });
        }

        if (error.code === 11000) {
          // Extract information about the duplicate key violation
          const keyPattern = error.keyPattern;
          const keyValue = error.keyValue;
        
          return res.status(400).json({
            success: false,
            message: `Duplicate key violation. The value '${JSON.stringify(keyValue)}' already exists for the key pattern: ${JSON.stringify(keyPattern)}`,
            keyPattern,
            keyValue,
          });
        }
        console.error(error);
        return res.status(500).json({
          success: false,
          message: 'Internal Server Error',
        });
      }
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };
  
//actiavteAccount
exports.activateAccount = async (req, res) => {
    try {
      const { token } = req.query;
      const email = req.query.email;
      
  
      if (!token || !email) {
        return res.status(400).json({
          success: false,
          message: 'Missing token or email',
        });
      }
  
      const user = await verificationLink(token, email, true, null);
      if(user){
        return res.redirect('https://ekamfront.vercel.app/activate-account/336259449494422343434ehsyysdbxfssun/user-giv/ltm=opopm/Activate');
      }

       
       else {
        
        return res.redirect('https://ekamfront.vercel.app/*');


      
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
}
  
//sign in

exports.signin = async(req,res)=>{

try {
  const {email,password}= req.body

  // check fieild
  if(!email || !password){
    return res.status(404).json({
      success:false,
      error:"please provide all fields"
    })
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User With this Email Not Existed",
    });
  }

  if(!user.isActive)
{
  return res.status(403).json({
    success: false,
    message: "User Not Activated",
  });
} 
   // Use bcrypt to compare passwords
   const passwordMatch = await bcrypt.compare(password, user.password);

   if (!passwordMatch) {
     return res.status(401).json({
       success: false,
       message: "Password Mismatch",
     });
   }
   const payload = {
    email: user.email,
    id: user._id,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7h",
  });

  // Remove the password from the user object before sending it in the response
  user.password = undefined;

  const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  return res.cookie("token", token, options).status(200).json({
    success: true,
    token,
    user,
    message: "Logged in successfully",
  });



} catch (error) {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
}


}

//Logout
exports.logout = async(req,res)=>{
    // Clear the authentication token (cookie) to log the user out
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  
}

//forgetPassword

exports.PasswordChange = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Step 1: Find the user with the provided email
    const user = await User.findOne({ email });

    // Step 2: Check if the user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 3: Update the user's password
    user.password = newPassword;

    // Step 4: Save the updated user object with the new password
    await user.save();

    // Step 5: Respond with a success message
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    // Step 6: Handle any errors that might occur during the process
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getMyPurchase = async (req, res) => {
  try {
    const userId = req.user.id;

    const purchases = await PurchaseModel.find({ user: userId }).populate('itemId');



    return res.status(200).json({ success: true, purchases });
  } catch (error) {
    console.error('Error in getMyPurchase:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


exports.contactForm = async (req, res) => {
  try {
    const { Name, Email, organisationName, phoneNumber, message } = req.body;

    // Validate the form data (you might want to use a validation library like Joi)

    // Create a new contact instance
    const newContact = new Contact({
      Name: Name,
      Email: Email,
      organisationName,
      phoneNumber,
      message,
    });

    // Save the contact form data to the database
    const savedContact = await newContact.save();

    // You can also send an email notification or perform other actions here

    // Respond to the client
    res.status(201).json({ message: 'Contact form submitted successfully', data: savedContact });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




