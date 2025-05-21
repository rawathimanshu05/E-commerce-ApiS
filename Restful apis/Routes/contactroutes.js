const express = require('express');

const contact = require('../Models/Contact')

const router = express.Router();

const { verifyTokenAdmin,verifyTokenUser } = require('../Verification')


router.post('/',async(req,res) =>{
    try{
        const data = new contact(req.body)
        await data.save()
        res.status(200).json({result:'success',message:'data inserted successfully',data})
    } catch(error){
        if(error.errors && error.errors.name)
            res.status(400).json({result:'some issue occur',message:error.errors.name.message})
        else if (error.errors && error.errors.email)
            res.status(400).json({result:'some issue occur',message:error.errors.email.message})
        else if (error.errors && error.errors.phone)
            res.status(400).json({result:'some issue occur',message:error.errors.phone.message})
        else if (error.errors && error.errors.message)
            res.status(400).json({result:'some issue occur',message:error.errors.message.message})
        else if (error.errors && error.errors.subject)
            res.status(400).json({result:'some issue occur',message:error.errors.subject.message})
        else
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})

router.put('/:_id',verifyTokenAdmin,async(req,res) =>{
    try{
         const data = await contact.findOne({_id:req.params._id})
         if(data){
            data.status = req.body.status ?? data.status
         }
         await data.save()
            res.status(200).json({result:'success',message:'data updated successfully',data})
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})

router.get('/',verifyTokenAdmin,async(req,res) => {
    try{
         const data = await contact.find().sort({_id:-1})
         res.status(200).json({result:'success',total:data.length,data:data})
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
}) 

router.get('/:_id',verifyTokenAdmin,async(req,res) =>{
    try{
        const data = await contact.findOne({_id:req.params._id})
        if(data){
            res.status(200).json({result:'success',data})
        } else{
            res.status(404).json({result:'not found',message:'data not found'})
        }
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})

router.delete('/:_id',verifyTokenAdmin,async(req,res) =>{
    try{
        const data = await contact.findOne({_id:req.params._id})
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
          const data = await contact.deleteMany()
            res.status(200).json({result:'success',message:'all data deleted successfully'})
    } catch(error){
        res.status(500).json({result:'some issue occur',message:error.message})
    }
})



module.exports = router;