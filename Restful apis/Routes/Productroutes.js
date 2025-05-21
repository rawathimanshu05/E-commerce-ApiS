const express = require('express');

const Product = require('./../Models/Product')
const multer = require('multer')
const fs = require('fs')

const { verifyTokenAdmin, verifyTokenUser } = require('../Verification')



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Products')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({ storage: storage })

const router = express.Router();

router.post('/', verifyTokenAdmin, upload.fields([
    { name: "pic1", maxCount: 1 },
    { name: "pic2", maxCount: 1 },
    { name: "pic3", maxCount: 1 },
    { name: "pic4", maxCount: 1 }
]), async (req, res) => {
    try {
        const data = new Product(req.body)
        data.finalprice = Math.round(parseInt(parseInt(req.body.baseprice) - (parseInt(req.body.baseprice) * parseInt(req.body.discount) / 100)))

        if (req.files.pic1)
            data.pic1 = req.files.pic1[0].filename;

        if (req.files.pic2)
            data.pic2 = req.files.pic2[0].filename;

        if (req.files.pic3)
            data.pic3 = req.files.pic3[0].filename;

        if (req.files.pic4)
            data.pic4 = req.files.pic4[0].filename;


        await data.save()
        res.status(200).json({ result: 'success', message: 'data inserted successfully', data })
    } catch (error) {
        console.log(error)
        if (error.keyValue)
            res.status(400).json({ result: 'some issue occur', message: 'name already exist' })
        if (error.errors && error.errors.name)
            res.status(400).json({ result: 'some issue occur', message: error.errors.name.message })
        if (error.errors && error.errors.maincategory)
            res.status(400).json({ result: 'some issue occur', message: error.errors.maincategory.message })
        if (error.errors && error.errors.subcategory)
            res.status(400).json({ result: 'some issue occur', message: error.errors.subcategory.message })
        if (error.errors && error.errors.brand)
            res.status(400).json({ result: 'some issue occur', message: error.errors.brand.message })
        if (error.errors && error.errors.size)
            res.status(400).json({ result: 'some issue occur', message: error.errors.size.message })
        if (error.errors && error.errors.color)
            res.status(400).json({ result: 'some issue occur', message: error.errors.color.message })
        if (error.errors && error.errors.baseprice)
            res.status(400).json({ result: 'some issue occur', message: error.errors.baseprice.message })
        else
            res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})


router.get('/', async (req, res) => {
    try {
        const data = await Product.find().sort({ _id: -1 })
        res.status(200).json({ result: 'success', total: data.length, data: data })
    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})

router.get('/:_id', async (req, res) => {
    try {
        const data = await Product.findOne({ _id: req.params._id })
        if (data)
            res.status(200).json({ result: 'success', data })
        else
            res.status(404).json({ result: 'not found', message: 'data not found' })

    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})


router.put('/:_id', verifyTokenAdmin, upload.fields([
    { name: "pic1", maxCount: 1 },
    { name: "pic2", maxCount: 1 },
    { name: "pic3", maxCount: 1 },
    { name: "pic4", maxCount: 1 }
]), async (req, res) => {
    try {
        const data = await Product.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.maincategory = req.body.maincategory ?? data.maincategory
            data.subcategory = req.body.subcategory ?? data.subcategory
            data.brand = req.body.brand ?? data.brand
            data.size = req.body.size ?? data.size
            data.color = req.body.color ?? data.color
            data.baseprice = req.body.baseprice ?? data.baseprice
            data.discount = req.body.discount ?? data.discount
            data.finalprice = Math.round(parseInt(parseInt(data.baseprice) - (parseInt(data.baseprice) * parseInt(data.discount) / 100)))
            data.status = req.body.status ?? data.status

            // pic 1 
            try {
                if (req.files.pic1) {
                    fs.unlinkSync(`public/Products/${data.pic1}`)
                }
            } catch (error) { }

            if (req.files.pic1)
                data.pic1 = req.files.pic1[0].filename;

            // pic 2 
            try {
                if (req.files.pic2) {
                    fs.unlinkSync(`public/Products/${data.pic2}`)
                }
            } catch (error) { }

            if (req.files.pic2)
                data.pic2 = req.files.pic2[0].filename;

            // pic 3
            try {
                if (req.files.pic3) {
                    fs.unlinkSync(`public/Products/${data.pic3}`)
                }
            } catch (error) { }

            if (req.files.pic3)
                data.pic3 = req.files.pic3[0].filename;

            // pic 4

            try {
                if (req.files.pic4) {
                    fs.unlinkSync(`public/Products/${data.pic4}`)
                }
            } catch (error) { }

            if (req.files.pic4)
                data.pic4 = req.files.pic4[0].filename;

            await data.save()
            res.status(200).json({ result: 'success', message: 'data updated successfully', data })
        } else {
            res.status(404).json({ result: 'not found', message: 'data not found' })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})


router.delete('/', verifyTokenAdmin, async (req, res) => {
    try {
        await Product.deleteMany()
        res.status(200).json({ result: 'success', message: 'all data deleted successfully' })
    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})


router.delete('/:_id', verifyTokenAdmin, async (req, res) => {
    try {
        const data = await Product.findOne({ _id: req.params._id })
        try {
            fs.unlinkSync(`public/Products/${data.pic1}`)
        } catch (error) { }
        try {
            fs.unlinkSync(`public/Products/${data.pic2}`)
        } catch (error) { }
        try {
            fs.unlinkSync(`public/Products/${data.pic3}`)
        } catch (error) { }
        try {
            fs.unlinkSync(`public/Products/${data.pic4}`)
        } catch (error) { }
        await data.deleteOne()
        res.status(200).json({ result: 'success', message: 'data deleted successfully' })
    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })

    }
})


router.post('/search', async (req, res) => {
    try {
        var data = await Product.find({
            $or: [
                { name: { $regex: `.*${req.body.search}.*`, $options: 'i' } },
                { maincategory: { $regex: `.*${req.body.search}.*`, $options: 'i' } },
                { subcategory: { $regex: `.*${req.body.search}.*`, $options: 'i' } },
                { brand: { $regex: `.*${req.body.search}.*`, $options: 'i' } },
                { color: { $regex: `.*${req.body.search}.*,$options:'i` } },
                { size: { $regex: `.*${req.body.search}.*`, $options: 'i' } },
                { stock: { $regex: `.*${req.body.search}.*`, $options: 'i' } },
                { description: { $regex: `.*${req.body.search}.*,$options:'i` } }
            ]
        })
        res.status(200).json({ result: 'success', total: data.length, data })

    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})






module.exports = router