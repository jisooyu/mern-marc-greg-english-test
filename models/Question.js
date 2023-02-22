const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = Schema({
    chapterId: {
        type: Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true
    },
    quiz: [{
        type: String,
        required: true
    }],
    options: [{
        stype: String
    }],
    correctAnswer: [{
        type: String,
        required: true
    }]
})

module.exports = mongoose.model('Question', questionSchema);