
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Table = new Schema({    
    ClassID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('job', Table);