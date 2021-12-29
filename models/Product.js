const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description: {
        type : String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    categories: [ String ],
    size: {
        type: String
    },
    color: {
        type: String
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = User = mongoose.model('product',ProductSchema)