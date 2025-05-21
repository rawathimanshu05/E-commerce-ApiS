const mongoose = require('mongoose');

const product = new mongoose.Schema({
    name:{
        type : String,
        required : true,
    },
    maincategory:{
        type : String,
        required : true,
    },
    subcategory :{
        type : String,
        required : true,
    },
    brand:{
        type : String,
        required : true,
    },
    size :{
        type : String,
        required: true
    },
    color:{
        type:String,
        required: true 
    },
    baseprice:{
        type : Number,
        required : true,
    },
    discount:{
        type : Number,
           default : 0
    },
    finalprice :{
        type : Number,
    },
    stock:{
        type : String,
        default :"In Stock"
    },
    description :{
        type : String,
        default :"This is sample Products"
    },
    pic1:{
        type : String,
        default : ""
    },
    pic2:{
        type : String,
        default : ""
    },
    pic3:{
        type : String,
        default : ""
    },
    pic4:{
        type : String,
        default : ""
    },
    status :{
        type : String,
        default : 'active',
    }
})

const prodcutcategroy = mongoose.model('products',product)
module.exports = prodcutcategroy