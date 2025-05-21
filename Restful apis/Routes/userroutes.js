const express = require('express');

const user = require('./../Models/User')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const fs = require('fs')
const bcrypt = require('bcrypt')
const { verifyTokenAdmin, verifyTokenUser } = require('../Verification')
const nodemailer = require('nodemailer')

var passwordValidator = require('password-validator');


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.Email_User,
        pass: process.env.Email_Pwd,
    },
});




var schema = new passwordValidator();
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                              // Must have uppercase letters
    .has().lowercase(1)                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123', 'admin@123', 'Admin@123', '12345678']); // Blacklist these values


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Users')
    },
    fieldsize: 1048576,
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({ storage: storage })

const router = express.Router();



router.post('/', async (req, res) => {
    try {
        const data = new user(req.body)
        const password = req.body.password
        if (!password) {
            return res.status(400).json({ result: 'some issue occur', message: 'password is required' })
        }
        if (!schema.validate(password)) {
            return res.status(400).json({ result: 'some issue occur', message: 'password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 2 digits and not include spaces or common passwords' })
        }
        data.password = await bcrypt.hash(password, 12)
        await data.save()
        res.status(200).json({ result: 'success', message: 'data inserted successfully', data })


    } catch (error) {
        if (error.keyValue)
            res.status(400).json({ result: 'some issue occur', message: 'name already exist' })
        if (error.errors && error.errors.name)
            res.status(400).json({ result: 'some issue occur', message: error.errors.name.message })
        if (error.errors && error.errors.username)
            res.status(400).json({ result: 'some issue occur', message: error.errors.username.message })
        if (error.errors && error.errors.email)
            res.status(400).json({ result: 'some issue occur', message: error.errors.email.message })
        if (error.errors && error.errors.phone)
            res.status(400).json({ result: 'some issue occur', message: error.errors.phone.message })
        if (error.errors && error.errors.password)
            res.status(400).json({ result: 'some issue occur', message: error.errors.password.message })
        else
            res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})


router.get('/', verifyTokenAdmin, async (req, res) => {
    try {
        const data = await user.find().sort({ _id: -1 })
        res.status(200).json({ result: 'success', total: data.length, data: data })
    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})

router.get('/:_id', verifyTokenUser, async (req, res) => {
    try {
        const data = await user.findOne({ _id: req.params._id })
        if (data)
            res.status(200).json({ result: 'success', data })
        else
            res.status(404).json({ result: 'not found', message: 'data not found' })

    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})


router.put('/:_id', verifyTokenUser, upload.single("pic"), async (req, res) => {
    try {
        const data = await user.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.email = req.body.email ?? data.email
            data.phone = req.body.phone ?? data.phone
            data.addressline1 = req.body.addressline1 ?? data.addressline1
            data.addressline2 = req.body.addressline2 ?? data.addressline2
            data.addressline3 = req.body.addressline3 ?? data.addressline3
            data.pin = req.body.pin ?? data.pin
            data.city = req.body.city ?? data.city
            data.state = req.body.state ?? data.state
            data.role = req.body.role ?? data.role
            data.status = req.body.status ?? data.status

            // pic 1 
            try {
                if (req.file && data.pic) {
                    fs.unlinkSync(`public/Users/${data.pic}`)
                }
            } catch (error) { }

            if (req.file)
                data.pic = req.file.filename;



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
        await user.deleteMany()
        res.status(200).json({ result: 'success', message: 'all data deleted successfully' })
    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})


router.delete('/:_id', verifyTokenAdmin, async (req, res) => {
    try {
        const data = await user.findOne({ _id: req.params._id })
        try {
            fs.unlinkSync(`public/Users/${data.pic}`)
        } catch (error) { }
        await data.deleteOne()
        res.status(200).json({ result: 'success', message: 'data deleted successfully' })
    } catch (error) {
        res.status(500).json({ result: 'some issue occur', message: error.message })

    }
})



router.post('/login', async (req, res) => {
    try {
        const data = await user.findOne({ username: req.body.username })
        //    console.log(data)
        if (!data) {
            return res.status(400).json({ result: 'some issue occur', message: 'username or password is incorrect' })
        }
        const isMatch = await bcrypt.compare(req.body.password, data.password)
        if (data.role === "Admin") {
            const token = jwt.sign({ data }, process.env.SAULTKEYADMIN, { expiresIn: '1d' })
            res.status(200).json({ result: 'success', message: 'login successfully', data, token })
        } else (data.role === "User")
        {
            const token = jwt.sign({ data }, process.env.SAULTKEYUSER, { expiresIn: '1d' })
            res.status(200).json({ result: 'success', message: 'login successfully', data, token })
        }


        if (!isMatch) {
            return res.status(400).json({ result: 'some issue occur', message: 'password is incorrect' })
        }
        res.status(200).json({ result: 'success', message: 'login successfully', data, token })

    } catch (error) {
        if (error.keyValue)
            res.status(400).json({ result: 'some issue occur', message: 'name already exist' })
        if (error.errors && error.errors.name)
            res.status(400).json({ result: 'some issue occur', message: error.errors.name.message })
        if (error.errors && error.errors.username)
            res.status(400).json({ result: 'some issue occur', message: error.errors.username.message })
        if (error.errors && error.errors.email)
            res.status(400).json({ result: 'some issue occur', message: error.errors.email.message })
        if (error.errors && error.errors.phone)
            res.status(400).json({ result: 'some issue occur', message: error.errors.phone.message })
        if (error.errors && error.errors.password)
            res.status(400).json({ result: 'some issue occur', message: error.errors.password.message })
        else
            res.status(500).json({ result: 'some issue occur', message: error.message })
    }
})




router.post('/forgetpassword-1', async (req, res) => {
    try {
        const data = await user.findOne({ username: req.body.username })
        if (data) {
            var num = Math.floor(Math.random() * 1000000 % 1000000);
            data.otp = num

            const useremail = {
                from: process.env.Email_User,
                to: data.email,
                subject: 'OTP for password reset! : Team Ecommerce',
                text: `OTP for password reset is ${num}!! \n\nBest regards,\nEcommerce Team`
            }

            transporter.sendMail(useremail, (error, info) => {
                if (error) {
                    console.error('Error sending email to admin:', error);
                    return res.status(500).json({ error: 'Failed to send email to admin', success: false });
                }
                // console.log('Email sent to admin:', info.response);

                transporter.sendMail(useremail, (error, info) => {
                    if (error) {
                        console.error('Error sending email to user:', error);
                        return res.status(500).json({ error: 'Failed to send confirmation email to user', success: false });
                    }
                    // console.log('Email sent to user:', info.response);
                    res.status(200).json({ message: 'Emails sent successfully!', success: true });

                })
            })

            await data.save()
            res.status(200).json({ result: 'Done', message: 'OTP Sent on Registerd Email Id' })
        } else {
            res.status(401).json({ result: 'Fail', message: 'Invalid username' })
        }

    } catch (error) {
        res.status(500).json({ result: 'Fail', message: 'Internal Server Error', error: error.message })
    }
})



router.post('/forgetpassword-2', async (req, res) => {
    try {
        const data = await user.findOne({ username: req.body.username })
        if (data) {
            if (data.otp === req.body.otp)
                res.send({ result: 'Done' })
            else
                res.status(401).json({ result: 'Fail', message: 'Invalid OTP' })
        } else {
            res.status(401).json({ result: 'Fail', message: 'Invalid username' })
        }
    } catch (error) {
        res.status(500).json({ result: 'Fail', message: 'Internal Server Error', error: error.message })
    }
})


router.post('/forgetpassword-3', async (req, res) => {
    try {
        const data = await user.findOne({ username: req.body.username })
        if (data) {
            if (!schema.validate(req.body.password)) {
                res.status(400).json({ result: 'some issue occur', message: 'password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 2 digits and not include spaces or common passwords' })
            }
            data.password = await bcrypt.hash(req.body.password, 12)
            await data.save()
            res.status(200).json({ result: 'success', message: 'password updated successfully' })
        } else {
            res.status(401).json({ result: 'Fail', message: 'Invalid username' })
        }
    } catch (error) {
        res.status(500).json({ result: 'Fail', message: 'Internal Server Error', error: error.message })
    }
})





module.exports = router