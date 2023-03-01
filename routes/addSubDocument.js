const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Question = require('../models/Question');

router.post('/',
    [check('documentId', 'document Idis required').not().isEmpty(),
    check('objectId', 'object Id required').not().isEmpty(),
    check('chapterTitle', 'chapter title is required').not().isEmpty(),
    check('quiz', 'quiz is required').not().isEmpty(),
    check('correctAnswer', 'Answer is required').not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { documentId, objectId, chapterTitle, quiz, correctAnswer } = req.body;
        try {
            question = {
                quiz: quiz,
                correctAnswer: correctAnswer
            }
            const chapter = {
                chapterTitle: chapterTitle,
                quizzes: [question]
            };
            const modelQuestion = await Question.findById(documentId);
            await modelQuestion.keys.push(chapter);
            await modelQuestion.save();

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: "Server Error from question.js" })
        }
    }
)
module.exports = router;