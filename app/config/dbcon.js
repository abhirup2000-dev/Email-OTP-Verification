require('dotenv').config()
const mongoose = require('mongoose')

const DB_URL = process.env.DATABASE_URL

const DatabaseConnecting = async ()=>{
  try{
    const connect = await mongoose.connect(DB_URL)
    if(connect){
      console.log('Database connected')
    }else{
      console.log('Database not connected')
    }
  }catch(err){
    console.log(err)
  }
}

module.exports = DatabaseConnecting