
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Table = new Schema({    
    ClassID: {
        type: String,
        required: true
    },
    UserID: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('classUser', Table);