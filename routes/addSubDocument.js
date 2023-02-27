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
            // await Question.findById(documentId, function (err, question) {
            //     question.keys.push(key);
            //     question.save(function (err, result) {
            //         if (err) {
            //             console.log("unable to add new object to keys");
            //         } else {
            //             console.log(result);
            //         }
            //     })
            // })

            const modelQuestion = await Question.findById(documentId);
            // const objectKeyIndx = modelQuestion.keys.findById(objectId);
            // console.log("objectKeyIndx from addSubDocument", objectKeyIndx)
            // modelQuestion.keys[objectId].push(chapter);
            // await modelQuestion.save();
            await modelQuestion.keys.unshift(chapter)
            // await modelQuestion.keys.push(chapter);
            await modelQuestion.save();

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: "Server Error from question.js" })
        }
    }
)
module.exports = router;