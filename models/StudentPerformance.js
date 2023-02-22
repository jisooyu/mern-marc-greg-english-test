const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentPerformanceSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student', required: true
    },
    chapterId: {
        type: Schema.Types.ObjectId,
        ref: 'Chapter', required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model('StudentPerformance', studentPerformanceSchema)
