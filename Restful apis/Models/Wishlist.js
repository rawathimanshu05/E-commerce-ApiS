const mongoose = require('mongoose');

const wishlist = new mongoose.Schema({
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
    pic:{
        type : String,
        default : "",
    }
})

const wishlistcatergroy = mongoose.model('wishlist',wishlist)
module.exports = wishlistcatergroy