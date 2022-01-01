const express = require('express')
const joi = require('joi')
const router = express.Router()
const Cart = require('../models/Cart')
const { auth, authOwner, authAdmin } = require('../middleware/auth')
const { route } = require('./user')

const validateCart = (cart) => {
    const schema = joi.object({
        product: joi.string().required(),
        quantity: joi.number().required()
    })

    const result = schema.validate(cart)
    return result
}

router.get('/', auth, async (req,res) => {
    try {
        const cart = await Cart.findOne({ user : req.user.id })
        return res.send(cart)
    } catch (err){
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

router.get('/:userId', authAdmin, async (req,res) => {
    try{
        const cart = await Cart.findOne(req.param.userId)
        if(!cart){
            return res.status(400).json({error: "No Cart found"})
        }
        return res.send(cart)
    } catch(err){
        console.error(err.message)
        if (err.kind === 'ObjectId'){
            return res.status(400).json({error: "No Cart found"})
        }
        res.status(500).send("Server Error")
    }
})

router.post('/', auth, async (req,res) => {
    result = validateCart(req.body)
    if(result.error){
        res.status(400).json({error: result.error.details[0].message })

    }
    try{
        // check if cart already exist for user
        const cart = await Cart.findOne({user:req.user.id})
        // if cart doesnt exist create new one
        if(!cart){
            const newCart = {
                user : req.user.id,
                products : [ req.body ]
            }
            const cart = new Cart(newCart)
            await cart.save()
            return res.send(cart)
        } else {
            // unshift in existing cart's product array
            cart.products.unshift(req.body)
            await cart.save()
            return res.send(cart)
        }
    } catch(err){
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

module.exports = router;