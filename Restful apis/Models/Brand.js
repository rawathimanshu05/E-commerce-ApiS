const mongoose = require('mongoose');

const brand = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        unique : true,
    },
    status :{
        type : String,
        default : 'active',
    }
})

const brandcategroy = mongoose.model('brands',brand)
module.exports = brandcategroy