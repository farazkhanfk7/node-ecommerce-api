const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    products : [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
            quantity : {
                type: Number,
                default: 1
            }
        }
    ],
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status : {
        type: String,
        default: "pending"
    }
});

module.exports = Order = mongoose.model('order',OrderSchema)