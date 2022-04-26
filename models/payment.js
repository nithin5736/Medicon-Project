const mongoose = require('mongoose')
// const Schema = mongoose.Schema

const paymentSchema = new mongoose.Schema({
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
const payment = mongoose.model('payment', paymentSchema);
module.exports = payment;