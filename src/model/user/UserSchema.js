const mongoose = require('mongoose');
const { token } = require('morgan');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        maxlength: 50,
        required: true
    },
    company: {
        type: String,
        maxlength: 50,
        required: true
    },
    address: {
        type: String,
        maxlength: 100,
    },
    phone: {
        type: Number,
        maxlength: 11,
    },
    email: {
        type: String,
        maxlength: 50,
        required: true,
        unique: true // Added to ensure email uniqueness
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 100,
        required: true
    },
    refreshJWT:{
        token:{
            type: String,
            maxlength:500,
            default: ''
        },
        addedAt : {
            type: Date,
            requird : true,
            default: Date.now(),
        }
    }
});

// Compile model and export directly
module.exports = mongoose.model('User', UserSchema);