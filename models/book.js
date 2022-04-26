const mongoose = require('mongoose')
const bookSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    age:{
        type: String,
        required: true,
    },
    mobileno:{
        type: String,
        required: true
    },

    testname:{
        type: String,
        required: true
    }
})
const book = mongoose.model('book', bookSchema);
module.exports = book;