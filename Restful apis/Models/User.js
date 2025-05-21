const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    addressline1: {
        type: String,
        default: ""
    },
    addressline2: {
        type: String,
        default: ""
    },
    addressline3: {
        type: String,
        default: ""
    },
    pin: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    pic:{
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "user"
    },
    otp: {
        type: Number,
    },
    status: {
        type: String,
        default: "active"
    },
})

const usermodel = mongoose.model('user', user)
module.exports = usermodel 