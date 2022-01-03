const express = require('express')
const router = express.Router()
const joi = require('joi')
const { auth, authAdmin } = require('../middleware/auth')
const Order = require('../models/Order')

const validateOrder = (order) => {
    const schema = joi.object({
        user : joi.string().required(),
        products : joi.array(joi.object().keys(
            { 
                product: joi.string(),
                quantity: joi.number() 
            }
        )),
        amount: joi.number().required(),
        addres: joi.string.required(),
        status: joi.string()
    })

    const result = schema.validate(order)
    return result
}

// GET Current user's order
router.get('/', auth, async (req,res) => {
    try{
        const orders = await Order.find({ user : req.user.id })
        if (!orders){
            return res.status(404).json({error:"No Object found"})
        }
        res.json(orders)
    } catch(err){
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(400).json({error:"No Object found"})
        }
    }
})

// Get order by ID
router.get('/:id', authAdmin, async (req,res) => {
    try{
        const order = await Order.findById(req.params.id)
        if (!order){
            return res.status(404).json({error:"No Object found"})
        }
        res.send(order)
    }catch(err){
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({error:"No Object found"}) 
        }
        res.status(500).send('Server Error')
    }
})

// Create Order
router.post('/', auth, async (req,res) => {
    // validate req.body
    const result = validateOrder(req.body)
    if(result.error){
        return res.status(400).json({ error: result.error.details[0].message})
    }
    try{
        // create order
        const order = new Order(req.body)
        await order.save()
        res.json(order)
    } catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// Update Order
router.put('/:id', authAdmin, async (req,res) => {
    const result = validateOrder(req.body)
    if(result.error){
        return res.status(400).json({ error: result.error.details[0].message })
    }
    try{
        // find order
        // update order
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,
            {
                $set : req.body
            },
            { new: true }
        )
        if (!updatedOrder){
            return res.status(404).json({error:"No Object found"})
        }
        await updatedOrder.save()
        // save
        res.send(updatedOrder)
    } catch(err){
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({error:"No Object found"}) 
        }
        res.status(500).send('Server Error')
    }
})

// DELETE Order
router.delete('/:id', authAdmin, async (req,res) => {
    try{
        const order = await Order.findByIdAndRemove(req.params.id)
        if (!order){
            return res.status(404).json({error:"No Object found"})
        }
        return res.json({ msg : "Order removed successfully"});
    } catch(err){
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({error:"No Object found"}) 
        }
        res.status(500).send('Server Error')
    }
})



module.exports = router;