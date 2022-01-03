const express = require('express')
const joi = require('joi')
const router = express.Router()
const Cart = require('../models/Cart')
const Product = require('../models/Product')
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

// GET cart for current user
router.get('/', auth, async (req,res) => {
    try {
        const cart = await Cart.findOne({ user : req.user.id })
        return res.json(cart)
    } catch (err){
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

// Get Cart by userID
router.get('/:userId', authAdmin, async (req,res) => {
    try{
        const cart = await Cart.findOne(req.param.userId)
        if(!cart){
            return res.status(400).json({error: "No Cart found"})
        }
        return res.json(cart)
    } catch(err){
        console.error(err.message)
        if (err.kind === 'ObjectId'){
            return res.status(400).json({error: "No Cart found"})
        }
        res.status(500).send("Server Error")
    }
})

// Create new Cart or Add to Cart
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
            return res.json(cart)
        } else {
            // unshift in existing cart's product array
            const productId = req.body.product
            const arr = cart.products.map( product => product.product.toString() )
            const index = arr.indexOf(productId)
            // if product is not already there in cart
            if(index === -1){
                cart.products.unshift(req.body)
            } else{
                // if product is already in cart ( remove and add new )
                cart.products.splice(index,1);
                cart.products.unshift(req.body)
            }
            await cart.save()
            return res.json(cart)
        }
    } catch(err){
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

// PUT Update product in cart
router.put('/:productId', auth, async(req,res) => {
    try{
        result = validateCart(req.body)
        if(result.error){
            res.status(400).json({error: result.error.details[0].message })
        }
        // find cart for user
        const cart = await Cart.findOne({user:req.user.id})
        //if cart doesnt exist return error
        if(!cart){
            return res.status(400).json({error: "No Cart found"})
        }
        // if cart exist change
        const arr = cart.products.map( product => product.product.toString() )
        const removeIndex = arr.indexOf(req.params.productId)
        cart.products.splice(removeIndex,1);
        cart.products.unshift(req.body);
        await cart.save();
        res.json(cart);
    } catch(err){
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(400).json({error: "No Product found"})
        }
        res.status(500).send('Server Error')
    }
});

// Delete remove product from cart
router.delete('/:productId', auth, async(req,res) => {
    try{
        // find cart for user
        const cart = await Cart.findOne({user:req.user.id})
        //if cart doesnt exist return error
        if(!cart){
            return res.status(400).json({error: "No Cart found"})
        }
        // if cart exist change
        const arr = cart.products.map( product => product.product.toString() )
        const removeIndex = arr.indexOf(req.params.productId)
        if(!removeIndex){
            return res.status(400).json({error: "No Product found"})
        }
        cart.products.splice(removeIndex,1);
        await cart.save();
        res.json(cart)
    } catch(err){
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(400).json({error: "No Product found"})
        }
        res.status(500).send('Server Error')
    }
})

module.exports = router;