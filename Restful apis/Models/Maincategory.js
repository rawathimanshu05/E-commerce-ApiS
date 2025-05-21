const mongoose = require('mongoose');

const main = new mongoose.Schema({
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

const maincategory = mongoose.model('maincategory',main)
module.exports = maincategory