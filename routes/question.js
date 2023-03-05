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
            // frontend 에서 입력한 chapterTitle이 이미 mongo db에 있는 찾아 봄
            const question = await Question.findOne({ 'keys.chapterTitle.title': chapterTitle });
            // update the document to add the new quiz to the chapter with the specified chapterTitle
            // 이미 chapterTitle.title (e.g. pss-1-1-1) 이 mongo db에 있는 경우
            if (question) {
                if (chapterIndex > -1) {
                    question.keys[0].chapterTitle[chapterIndex].quizzes.push({ quiz: quiz, correctAnswer: correctAnswer });
                    await question.save();
                } else {
                    res.status(400).json({ error: "Invalid chapter title" });
                }
            } else {
                // 아직 chapterTitle.title이 mongo db에 없는 경우
                const newChapter = await Question.findById(documentId);
                // mongo db에 새로운 chapterTitle.titlez을 저장
                newChapter.keys[0].chapterTitle.push({ title: chapterTitle });
                // frontend에서 이미지를 보냈다면
                if (typeof req.file != 'undefined') {
                    const image = req.file;
                    // upload imageFile to AWS S3
                    const result = await upload(image);
                    // AWS S3에 저장한 이미지 url을 mongoose model에 push
                    if (result) {
                        // newChapter.keys[0].chapterTitle[chapterIndex].s3ImageUrl.push(result.Location); // in case,  the s3ImageUrl is array
                        newChapter.keys[0].chapterTitle[chapterIndex].s3ImageUrl = result.Location;
                    }
                } else {
                    // frontend에서 보낸 이미지가 없다면.. 
                    console.log("No image to upload")
                }
                // quiz와 correctAnswer를 mongoose model에 push
                newChapter.keys[0].chapterTitle[chapterIndex].quizzes.push({ quiz: quiz, correctAnswer: correctAnswer });
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