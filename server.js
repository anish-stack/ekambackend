const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv")
dotenv.config()
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const ConectDb = require('./config/database')
const Userouter = require("./routes/useroutes")
const workshopRoutes = require("./routes/workshopRoutes")
const PORT = process.env.PORT ;
// Set up CORS and other middleware
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//Database connextion
ConectDb()



app.get("/", (req, res) => {
    res.send("payment success Innocation!");
  });

  app.get('/form',(req,res)=>{
    res.sendFile(__dirname + "/insta.html")
  })
//   const Insta = require('instamojo-nodejs')


//   const AUTH_KEY = "a73af17827d619ef3ef5478ad81c0af7"
//   const AUTH_TOKEN = "d8c5b9b43ef32c6b6a302592ee6910ee"

//   Insta.setKeys(AUTH_KEY,AUTH_TOKEN)

//   Insta.isSandboxMode(true)
//   app.post('/pay',(req,res)=>{
//     var name = req.body.name
//     var email = req.body.email
//     var amount = req.body.amount


//     console.log(name,email,amount)

// const data = new Insta.PaymentData()

// const REDIRECT_URL = "http://localhost:4000"

// data.setRedirectUrl(REDIRECT_URL)
// data.send_email = 'True'
// data.purpose ='Test'

// Insta.createPayment(data, function (error, response) {
//   if (error) {
//     console.error("Payment creation failed:", error);
//     res.status(500).send("Payment creation failed");
//   } else {
//     console.log(response);
//     res.send("Please Check Your Email To Make A payment");
//   }
// });


//   })

 //routes
 
app.get("/", (req, res) => {
  res.send("payment success Innocation!");
});


 app.use('/api/v1',Userouter)
 app.use('/api/v2',workshopRoutes)





  

  // Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on Port number ${PORT}`);
  });