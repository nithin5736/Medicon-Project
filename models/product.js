const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    }
})

const product = mongoose.model('Product', productSchema);
module.exports = product;