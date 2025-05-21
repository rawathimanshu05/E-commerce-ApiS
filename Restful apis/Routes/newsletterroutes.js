const express = require('express');

const newsletters = require('../Models/Newsletter')
const router = express.Router();

const { verifyTokenAdmin,verifyTokenUser } = require('../Verification')


router.post('/',async(req,res) => {
    try{
        const data = new newsletters(req.body)
        await data.save()
        res.status(200).json({result:'success',message:'data inserted successfully',data})

    } catch(error){
        if(error.keyValue)
            res.status(400).json({result:'some issue occur',message:'email already exist'})
        else if (error.errors && error.errors.email)
            res.status(400).json({result:'some issue occur',message:error.errors.email.message})
        else 
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})

router.get('/',verifyTokenAdmin,async(req,res) =>{
    try{
        const data = await newsletters.find().sort({_id:-1})
        res.status(200).json({result:'success',total:data.length,data:data})
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})

router.delete('/:_id',verifyTokenAdmin,async(req,res) => {
    try{
        const data = await newsletters.findOne({_id:req.params._id})
        if(data){
            await data.deleteOne()
            res.status(200).json({result:'success',message:'data deleted successfully'})
        } else {
            res.status(404).json({result:'not found',message:'data not found'})
        }
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})

router.delete('/',verifyTokenAdmin,async(req,res) =>{
    try{
         const data = await newsletters.deleteMany()
            res.status(200).json({result:'success',message:'all data deleted successfully'})
    } catch(error){
        res.status(500).json({result :'some issue occur',message:error.message})
    }
})

router.get('/:_id',verifyTokenAdmin,async(req,res) =>{
    try{
       const data = await newsletters.findOne({_id:req.params._id})
       if(data)
        res.status(200).json({result:'success',data})
    else 
        res.status(404).json({result:'not found',message:'data not found'})
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})



module.exports = router;