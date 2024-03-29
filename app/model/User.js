const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({    
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true 
    },
    role: {
        type: String,
    },
    level: {
        type: String,
    },
    token: {
        type: String,
    },
}, { timestamps: true },);

module.exports = mongoose.model('User', userSchema);

