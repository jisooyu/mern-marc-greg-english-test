const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Question = require('../models/Question');

router.post('/',
    [check('chapterTitle', 'chapter title is required').not().isEmpty(),
    check('quiz', 'quiz is required').not().isEmpty(),
    check('correctAnswer', 'Answer is required').not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { chapterTitle, quiz, correctAnswer } = req.body;
        try {
            const quizzes = { quiz, correctAnswer };
            const chapter = {
                title: chapterTitle,
                quizzes: [quizzes]
            };
            const questionModel = await new Question({
                keys: [{ chapterTitle: [chapter] }]
            });
            await questionModel.save(function (err, result) {
                if (err) {
                    console.log("failed to save the new question data: ", err);
                } else {
                    console.log(result);
                }
                // mongoose.connection.close();
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: "Server Error from question.js" })
        }
    }
)
module.exports = router;