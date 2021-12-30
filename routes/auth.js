const express = require('express')
const router = express.Router()
const joi = require('joi')
const User = require('../models/User')
const bcrypt = require('bcrypt')

const validateUser = (user) => {
    const schema = joi.object({
        email: joi.string().email(),
        password: joi.string().min(2).required()
    })

    const result = schema.validate(user)
    return result
}

// route GET api/auth ( Current User details )
router.get('/', auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err){
        console.error(err.message);
        res.status(500).json({ msg : "Server Error"});
    }
});

// Login
router.post('/', async (req,res)=>{
    // validate req body
    const result = validateUser(req.body)
    if(result.error){
        return res.send(400).json({ error: result.error.details[0].message})
    }
    // create an object
    try {
        const { email, password } = req.body;
        // check if user exists
        const user = await User.findOne({ email : email })
        if(!user){
            return res.send(401).json({error:"User not registered"})
        }
        // compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.send(401).json({error:"Invalid credentials"})
        }
        // return jwt token
        const token = user.generateAuthToken();
        return res.send(token);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }   
})

module.exports = router;