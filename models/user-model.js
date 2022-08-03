const mongoose = require('mongoose');
const S = mongoose.Schema

const productSchema = new S({
    name: String,
    category: String,
    image: String,
})

const userSchema = new S({
    gname: String,
    name: String,
    email: String,
    googleId: String,
    thumbnail: String,
    date: Date,
    product: [productSchema]
});


module.exports = mongoose.model('user', userSchema);
