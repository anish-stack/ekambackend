const mongodb = require('mongoose')
require('dotenv').config()
const URL = process.env.MONGO_URL

const ConnectDb = async()=>{
try{

await mongodb.connect(URL,{
  
    connectTimeoutMS: 100000
})
console.log("Connected to the database successfully!");
}catch(error){
    console.log("Error in connecting to database", error)
}
} 

module.exports = ConnectDb