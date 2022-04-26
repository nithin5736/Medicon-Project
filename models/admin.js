const mongoose = require('mongoose')
// const Schema = mongoose.Schema

const adminSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})

const adm = mongoose.model('admin', adminSchema);
module.exports = adm;