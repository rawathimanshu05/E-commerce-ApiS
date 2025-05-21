const express = require('express');

require('./Database/Db')
require('dotenv').config()
const app = express();

const maincategory = require('./Routes/maincategoryroutes')
const subcategory = require('./Routes/subcategoryroutes')
const brand = require('./Routes/brandroutes')
const product = require('./Routes/Productroutes')
const user = require('./Routes/userroutes')
const cart = require('./Routes/cartroutes')
const wishlist = require('./Routes/wishlistroutes')
const checkout = require('./Routes/checkoutroutes')
const newsletter = require('./Routes/newsletterroutes')
const contact = require('./Routes/contactroutes')

app.use(express.json());
app.use(express.static('public'))


app.use('/api/maincategory',maincategory)
app.use('/api/subcategory',subcategory)
app.use('/api/brand',brand)
app.use('/api/product',product)
app.use('/api/user',user)
app.use('/api/cart',cart)
app.use('/api/wishlist',wishlist)
app.use('/api/checkout',checkout)
app.use('/api/newsletter',newsletter)
app.use('/api/contact',contact)

const port = 8000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})