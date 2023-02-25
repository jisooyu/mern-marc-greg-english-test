const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Question = require('../models/Question');

// route GET
router.get('/', auth, async (req, res) => {
    try {
        const questions = await Question.find({ chapter: req.chapter.id }).sort({
            date: -1
        });
        res.json(questions);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});

// route: POST 
router.post('/',
    [check('quiz', 'question is required').not().isEmpty(),
    check('correctAnswer', 'Answer is required').not().isEmpty()],
    async (req, res) => {
        console.log("req.body from router.post ", req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { quiz, correctAnswer } = req.body;
        try {
            const newQuestion = new Question({
                quiz,
                correctAnswer,
            });
            // const question = await newQuestion.save();
            // question.chapterTitle.push(chapterTitle);
            // question.quiz.push(quiz);
            // question.correctAnswer.push(correctAnswer);
            // res.json(question)
            const question = await newQuestion.save();
            res.json(question)
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: "Server Error from question.js" })
        }
    }
);


module.exports = router;