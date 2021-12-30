const express = require('express')
const app = express()
const connectDB = require('./config/db')

//connecting mongo
connectDB();

//Init middleware
app.use(express.json())

app.get('/', (req,res) => {
    res.send("API working")
});

app.use('/api/auth', require('./routes/auth'))
app.use('/api/user', require('./routes/user'))
app.use('/api/product', require('./routes/product'))
app.use('/api/cart', require('./routes/cart'))
app.use('/api/order', require('./routes/order'))

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server Running on Port : ${port}`))