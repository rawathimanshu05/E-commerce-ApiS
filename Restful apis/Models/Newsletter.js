const mongoose = require('mongoose');

const newsletter = new mongoose.Schema({
    email :{
        type : String,
        unique : true,
        required : true
    }
})

const newsletters = mongoose.model('newsletters',newsletter)
module.exports = newsletters