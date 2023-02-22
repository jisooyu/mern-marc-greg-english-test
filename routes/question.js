const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
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
router.post('/', auth, requireAdmin,
    [check('chapterId', 'Chapter ID is required').not().isEmpty(),
    check('quiz', 'question is required').not().isEmpty(),
    check('correctAnswer', 'Answer is required').not().isEmpty()],
    async (req, res) => {
        if (!req.student.isAdmin) {
            return res.status(403).json({ message: 'Please get the permission to access this resource.' });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { chapterId, quiz, correctAnswer } = req.body;

        try {
            const newQuestion = new Question({
                chapterId,
                quiz,
                correctAnswer,
                student: req.student.id
            });
            const question = await newQuestion.save();
            newQuestion.chapterId.push(newQuestion.chapterId)
            newQuestion.quiz.push(newQuestion.quiz)
            newQuestion.correctAnswer.push(newQuestion.correctAnswer)
            res.json(question)
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;