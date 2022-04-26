const mongoose = require('mongoose')
// const Schema = mongoose.Schema

const customerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },

    confirmpassword:{
        type: String,
        required: true
    },
    cart:[],
    blockstatus:{
        type: String,
        default: false
    }
});


const customer = mongoose.model('customers', customerSchema);
module.exports = customer;