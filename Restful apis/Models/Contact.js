const mongoose = require('mongoose');

const contact = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: String
    },
    status:{
        type : String,
        default : "pending"
    }
})

const contactscatergroy = mongoose.model('contact',contact)
module.exports = contactscatergroy