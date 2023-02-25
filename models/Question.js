const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = Schema({
    quiz: [{
        type: String,
        required: true
    }],
    correctAnswer: [{
        type: String,
        required: true
    }]
})

module.exports = mongoose.model('Question', questionSchema);