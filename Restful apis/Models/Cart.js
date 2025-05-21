const mongoose = require('mongoose');

const cart = new mongoose.Schema({
    userId:{
        type : String,
        required : true,
    },
    productId:{
        type : String,
        required : true,
    },
    name:{
        type :String,
        required : true,
    }, 
    color:{
        type : String,
        required : true,
    },
    size:{
        type :String,
        required : true,
    },
    price:{
        type : Number,
        required : true,
    },
    qty :{
        type : Number,
        required : true,
    },
    total:{
        type : Number,
        required : true,
    },
    pic:{
        type : String,
        default : "",
    }
})

const cartscatergroy = mongoose.model('carts',cart)
module.exports = cartscatergroy