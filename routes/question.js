const express = require('express');
const multer = require('multer');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require("../controllers/awsController");
const { check, validationResult } = require('express-validator');

const Question = require('../models/Question');
// multer middleware
const multerUpload = multer({ dest: 'uploads/' });

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
router.post('/', multerUpload.single('imageFile'),
    [check('documentId', 'document ID is required').not().isEmpty(),
    check('chapterTitle', 'chapter title is required').not().isEmpty(),
    // check('imageFile', 'imageFile is required').not().isEmpty(),
    check('quiz', 'quiz is required').not().isEmpty(),
    check('correctAnswer', 'Answer is required').not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log("req.body from router.post ", req.body);
        const { documentId, chapterTitle, quiz, correctAnswer } = req.body;
        const chapterNum = chapterTitle.charAt(8); // extract chapter number(eg. pss-1-1-1) from chapterTitle
        let chapterIndex = chapterNum - 1; // pss-1-1-1 will be stored in array chapterTitle[0]
        try {
            const question = await Question.findOne({ 'keys.chapterTitle.title': chapterTitle });
            console.log("question from Question.findOne", question);
            // update the document to add the new quiz to the chapter with the specified chapterTitle
            if (question) {
                if (chapterIndex > -1) {
                    question.keys[0].chapterTitle[chapterIndex].quizzes.push({ quiz, correctAnswer });
                    await question.save();
                } else {
                    res.status(400).json({ error: "Invalid chapter title" });
                }
            } else {
                const newChapter = await Question.findById(documentId);
                newChapter.keys[0].chapterTitle.push({ title: chapterTitle });
                console.log("newChapter.keys[0].chapterTitle", newChapter.keys[0].chapterTitle);
                // console.log("newChapter.keys[0].chapterTitle[chapterIndex]", newChapter.keys[0].chapterTitle[chapterIndex]);
                // upload imageFile to AWS S3
                if (typeof req.file != 'undefined') {
                    const image = req.file;
                    const result = await upload(image);
                    if (result) {
                        newChapter.keys[0].chapterTitle[chapterIndex].push({ s3ImageUrl: result.Location });
                    }
                } else {
                    console.log("No image to upload")
                }
                // console.log("newChapter.keys[0].chapterTitle[chapterIndex]", newChapter.keys[0].chapterTitle[chapterIndex]);
                newChapter.keys[0].chapterTitle[chapterIndex].quizzes.push({ quiz, correctAnswer });
                console.log("newChapter", newChapter.keys[0].chapterTitle[chapterIndex]);
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