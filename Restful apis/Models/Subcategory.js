const mongoose = require('mongoose');

const sub = new mongoose.Schema({
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

const subcate = mongoose.model('subcategory',sub)
module.exports = subcate