const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecommerce')

.then(()=>{
    console.log('Connected to MongoDB successfully')
})
.catch((error) =>{
    console.log('Error connecting to MongoDB:', error)
})