const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    quiz: String,
    correctAnswer: String,
    s3ImageUrl: String
});

const chapterSchema = new mongoose.Schema({
    chapterTitle: [{
        title: String,
        quizzes: [quizSchema]
    }]
});

const questionModelSchema = new mongoose.Schema({
    keys: [chapterSchema]
});

const Question = mongoose.model('Question', questionModelSchema);

module.exports = Question;
