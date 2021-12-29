const mongoose = require('mongoose')
const config = require('config')
const dbURL = config.get("mongoURI")

const connectDB = async () => {
    await mongoose.connect(dbURL)
    console.log("MongoDB Connected")
}

module.exports = connectDB;