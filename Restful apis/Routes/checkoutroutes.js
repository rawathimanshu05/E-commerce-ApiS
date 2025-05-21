const express = require('express');
const checkout = require('../Models/Checkout')
const router = express.Router();

const { verifyTokenAdmin,verifyTokenUser } = require('../Verification')


router.post('/',verifyTokenUser,async(req,res)=>{
    try{
        const data = new checkout(req.body)
       data.date = new Date()
        await data.save()
        res.status(200).json({result:'success',message:'data inserted successfully',data})
    } catch(error){
        if (error.errors && error.errors.userId)
            res.status(400).json({result:'some issue occur',message:error.errors.userId.message})
        else if (error.errors && error.errors.totalAmount)
            res.status(400).json({result:'some issue occur',message:error.errors.totalAmount.message})
        else if (error.errors && error.errors.shippingAmount)
            res.status(400).json({result:'some issue occur',message:error.errors.shippingAmount.message})
        else if (error.errors && error.errors.finalAmount)
            res.status(400).json({result:'some issue occur',message:error.errors.finalAmount.message})
        else
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})


router.get('/user/:userId',verifyTokenUser,async(req,res)=>{
    try{
        const data = await checkout.find({userId:req.params.userId}).sort({_id:-1})
        res.status(200).json({result:'success',total:data.length,data:data})
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})

router.get('/',verifyTokenAdmin,async(req,res) =>{
    try{
        const data = await checkout.find().sort({_id:-1})
        res.status(200).json({result:'success',total:data.length,data:data})

    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})

router.get('/:_id',async(req,res)=>{
    try{
        const data = await checkout.findOne({_id:req.params._id})
        if(data)
            res.status(200).json({result:'success',data})
        else 
            res.status(404).json({result:'not found',message:'data not found'})

    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})


router.put('/:_id',verifyTokenAdmin,async(req,res)=>{
    try{
        const data = await checkout.findOne({_id:req.params._id})
        if(data)
                data.paymentMode = req.body.paymentMode ?? data.paymentMode
                data.paymentStatus = req.body.paymentStatus ?? data.paymentStatus
                data.orderStatus = req.body.orderStatus ?? data.orderStatus
                data.rppid = req.body.rppid ?? data.rppid 
           await data.save()
              res.status(200).json({result:'success',message:'data updated successfully',data})
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})


router.delete('/',verifyTokenAdmin,async(req,res)=>{
    try{
        await checkout.deleteMany()
        res.status(200).json({result:'success',message:'all data deleted successfully'})
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})


router.delete('/:_id',verifyTokenAdmin,async(req,res)=>{
    try{
        const data = await checkout.findOne({_id:req.params._id})
        await data.deleteOne()
        res.status(200).json({result:'success',message:'data deleted successfully'})
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})

    }
})





module.exports = router;