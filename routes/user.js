const express = require('express')
const router = express.Router()
const joi = require('joi')
const User = require('../models/User')
const bcrypt = require('bcrypt')

const validateUser = (user) => {
    const schema = joi.object({
        name: joi.string().min(2).required(),
        email: joi.string().email(),
        password: joi.string().min(2).required(),
        isAdmin : joi.boolean()
    })

    const result = schema.validate(user)
    return result
}

// Register
router.post('/', async (req,res)=>{
    // validate req body
    const result = validateUser(req.body)
    if(result.error){
        return res.status(400).json({ error: result.error.details[0].message})
    }
    // create an object
    try {
        const newUser = {
            name : req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        const user = new User(newUser)
        if (req.body.isAdmin){
            user.isAdmin = true
        }
        // encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        // save user
        await user.save()
        // return jwt token
        const token = user.generateAuthToken();
        return res.send(token);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }   
})

module.exports = router;