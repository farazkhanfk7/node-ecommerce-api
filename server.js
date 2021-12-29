const express = require('express')
const app = express()
const connectDB = require('./config/db')

//connecting mongo
connectDB();

app.get('/', (req,res) => {
    res.send("API working")
});

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server Running on Port : ${port}`))