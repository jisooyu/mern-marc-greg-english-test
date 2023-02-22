const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentResponseSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    response: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('StudentResponse', studentResponseSchema);
