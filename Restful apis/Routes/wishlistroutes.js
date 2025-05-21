const express = require('express');

const wishlist = require('../Models/Wishlist')

const router = express.Router();

const { verifyTokenAdmin,verifyTokenUser } = require('../Verification')


router.post('/',verifyTokenUser,async(req,res)=>{
    try{
        const data = new wishlist(req.body)
        await data.save()
        res.status(200).json({result:'success',message:'data inserted successfully',data})
    } catch(error){
        if (error.errors && error.errors.userId)
            res.status(400).json({result:'some issue occur',message:error.errors.userId.message})
        else if (error.errors && error.errors.productId)
            res.status(400).json({result:'some issue occur',message:error.errors.productId.message})
        else if (error.errors && error.errors.name)
            res.status(400).json({result:'some issue occur',message:error.errors.name.message})
        else if (error.errors && error.errors.color)
            res.status(400).json({result:'some issue occur',message:error.errors.color.message})
        else if (error.errors && error.errors.size)
            res.status(400).json({result:'some issue occur',message:error.errors.size.message})
        else if (error.errors && error.errors.price)
            res.status(400).json({result:'some issue occur',message:error.errors.price.message})
        else
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})


router.get('/:userId',verifyTokenUser,async(req,res)=>{
    try{
        const data = await wishlist.find({userId:req.params.userId}).sort({_id:-1})
        res.status(200).json({result:'success',total:data.length,data:data})
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})




router.delete('/',verifyTokenUser,async(req,res)=>{
    try{
        await wishlist.deleteMany()
        res.status(200).json({result:'success',message:'all data deleted successfully'})
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})


router.delete('/:_id',verifyTokenUser,async(req,res)=>{
    try{
        const data = await wishlist.findOne({_id:req.params._id})
        await data.deleteOne()
        res.status(200).json({result:'success',message:'data deleted successfully'})
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})

    }
})



module.exports = router