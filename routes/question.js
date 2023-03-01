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
        const chapterNum = chapterTitle.charAt(8); // extract chapter number(eg. pss-1-1-1) from chapterTitle
        console.log("chapterNum", chapterNum);
        let chapterIndex = chapterNum - 1; // pss-1-1-1 will be stored in array chapterTitle[0]
        console.log("chapterIndex", chapterIndex);
        try {
            const question = await Question.findOne({ 'keys.chapterTitle.title': chapterTitle });
            // update the document to add the new quiz to the chapter with the specified chapterTitle
            if (question) {
                if (chapterIndex > -1) {
                    question.keys[0].chapterTitle[chapterIndex].quizzes.push({ quiz, correctAnswer });
                    await question.save();
                } else {
                    res.status(400).json({ error: "Invalid chapter number" });
                }
            } else {
                const newChapter = await Question.findById(documentId);
                // console.log("newChapter", newChapter);
                newChapter.keys[0].chapterTitle.push({ title: chapterTitle });
                // console.log("chapterIndex", chapterIndex);
                newChapter.keys[0].chapterTitle[chapterIndex].quizzes.push({ quiz, correctAnswer });
                await newChapter.save();
            }
            res.status(200).json({ message: "Quizzes saved successfully" })
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: "Server Error from question.js" })
        }
    }
);



module.exports = router;