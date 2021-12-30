const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const config = require('config');

const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type : String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

UserSchema.methods.generateAuthToken = function() {
    const payload = { _id : this._id, isAdmin: this.isAdmin }
    const token = jwt.sign(payload, config.get('secretKey'), { expiresIn: 360000 })
    return token
}

module.exports = User = mongoose.model('user',UserSchema)