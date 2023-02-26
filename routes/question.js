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
    [check('documentId', 'document ID is required').not().isEmpty(),
    check('chapterTitle', 'chapter title is required').not().isEmpty(),
    check('quiz', 'quiz is required').not().isEmpty(),
    check('correctAnswer', 'Answer is required').not().isEmpty()],
    async (req, res) => {
        console.log("req.body from router.post ", req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { documentId, chapterTitle, quiz, correctAnswer } = req.body;
        try {
            const question = await Question.findById(documentId);
            const keyIndex = question.keys.findIndex(key => key.chapterTitle === chapterTitle);
            question.keys[keyIndex].quizzes.push({ quiz: quiz, correctAnswer: correctAnswer });
            await question.save();
            res.json(question)
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: "Server Error from question.js" })
        }
    }
);



module.exports = router;