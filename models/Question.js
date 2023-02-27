const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    quiz: String,
    correctAnswer: String
});

const chapterSchema = new mongoose.Schema({
    chapterTitle: [String], // chapter title
    quizzes: [quizSchema]
});

const questionModelSchema = new mongoose.Schema({
    keys: [chapterSchema]
});

const Question = mongoose.model('Question', questionModelSchema);

module.exports = Question;
