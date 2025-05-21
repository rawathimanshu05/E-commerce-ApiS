const mongoose = require('mongoose');

const checkout = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    paymentMode: {
        type: String,
        default: "COD"
    },
    paymentStatus: {
        type: String,
        default: "Pending"
    },
    orderStatus: {
        type: String,
        default: "Order is Placed"
    },
    rppid: {
        type: String,
        default: ""
    },
    date: {
        type: String
    },
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAmount: {
        type: Number,
        required: true
    },
    finalAmount: {
        type: Number,
        required: true
    },
    products: [
        {
            productId: {
                type: String
            },
            name: {
                type: String
            },
            color: {
                type: String
            },
            size: {
                type: String
            },
            price: {
                type: Number
            },
            qty: {
                type: Number
            },
            total: {
                type: Number
            },
            pic: {
                type: String
            }
        }
    ]
})

const checkoutcatergroy = mongoose.model('checkout', checkout)
module.exports = checkoutcatergroy