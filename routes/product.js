const express = require('express')
const router = express.Router()
const joi = require('joi')
const { auth, authAdmin } = require('../middleware/auth')
const Product = require('../models/Product')

const validateProduct = (product) => {
    const schema = joi.object({
        title: joi.string().min(2).required(),
        description: joi.string().required(),
        img: joi.string().min(2).required(),
        categories : joi.array().items(joi.string()),
        size : joi.string().valid('S','M','L','XL','XXL'),
        color : joi.string(),
        price : joi.number().required()
    })

    const result = schema.validate(product)
    return result
}

// Get Product by ID
router.get('/:id', auth, async (req,res) => {
    try{
        const product = await Product.findById(req.params.id)
        if (!product){
            return res.status(404).json({error:"No Object found"})
        }
        res.send(product)
    }catch(err){
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg : "No Object found."}) 
        }
        res.status(500).send('Server Error')
    }
})

// Create Product
router.post('/', authAdmin, async (req,res) => {
    // validate req.body
    const result = validateProduct(req.body)
    if(result.error){
        return res.status(400).json({ error: result.error.details[0].message})
    }
    try{
        // create product
        const newProduct = {
            title: req.body.title,
            description: req.body.description,
            img: req.body.img,
            categories : req.body.categories,
            size : req.body.size,
            color : req.body.color,
            price : req.body.price
        }

        const product = new Product(newProduct)
        await product.save()
        // save
        res.send(product)
    } catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// Update Product
router.put('/:id', authAdmin, async (req,res) => {
    // validate req.body
    const result = validateProduct(req.body)
    if(result.error){
        return res.status(400).json({ error: result.error.details[0].message})
    }
    try{
        // find product
        const product = await Product.findById(req.params.id)
        if (!product){
            return res.status(404).json({error:"No Object found"})
        }

        // get params from req.body
        const {
            title,
            description,
            img,
            categories,
            size,
            color,
            price
        } = req.body;

        // update product
        if (title) product.title = req.body.title
        if (description) product.description = req.body.description
        if (img) product.img = req.body.img
        if (categories) product.categories = req.body.categories
        if (size) product.size = req.body.size
        if (color) product.color = req.body.color
        if (price) product.price = req.body.price

        await product.save()
        // save
        res.send(product)
    } catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// DELETE Product
router.delete('/', authAdmin, async (req,res) => {
    try{
        const product = await Product.findByIdAndRemove(req.params.id)
        if (!product){
            return res.status(404).json({error:"No Object found"})
        }
        return res.json({ msg : "Post removed successfully"});
    } catch(err){
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg : "No Object found."}) 
        }
        res.status(500).send('Server Error')
    }
})



module.exports = router;