
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Table = new Schema({    
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    member: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('class', Table);