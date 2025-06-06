const express = require('express');

const brand = require('./../Models/Brand')

const { verifyTokenAdmin,verifyTokenUser } = require('../Verification')

const router = express.Router();

router.post('/', verifyTokenAdmin ,async (req, res) => {
    try {
        const data = new brand(req.body)
        await data.save()
        res.status(200).json({ result: 'success', message: 'data inserted successfully', data })
    } catch (error) {
        if (error.keyValue)
            res.status(400).json({ result: 'some issue occur', message: 'name already exist' })
        else
            res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})


router.get('/', async (req, res) => {
    try {
        const data = await brand.find().sort({ _id: -1 })
        res.status(200).json({ result: 'success', total: data.length, data: data })
    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})

router.get('/:_id', verifyTokenAdmin, async (req, res) => {
    try {
        const data = await brand.findOne({ _id: req.params._id })
        if (data)
            res.status(200).json({ result: 'success', data })
        else
            res.status(404).json({ result: 'not found', message: 'data not found' })

    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})


router.put('/:_id',verifyTokenAdmin, async (req, res) => {
    try {
        const data = await brand.findOne({ _id: req.params._id })
        if (data)
            data.name = req.body.name ?? data.name
        data.status = req.body.status ?? data.status
        await data.save()
        res.status(200).json({ result: 'success', message: 'data updated successfully', data })
    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})


router.delete('/', async (req, res) => {
    try {
        await brand.deleteMany()
        res.status(200).json({ result: 'success', message: 'all data deleted successfully' })
    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})


router.delete('/:_id', verifyTokenAdmin, async (req, res) => {
    try {
        const data = await brand.findOne({ _id: req.params._id })
        await data.deleteOne()
        res.status(200).json({ result: 'success', message: 'data deleted successfully' })
    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })

    }
})



module.exports = router