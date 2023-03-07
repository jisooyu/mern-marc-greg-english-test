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
        const sectionNum = chapterTitle.charAt(4); // extract sectoin number (e.g. pss-1-4-5 ----> 1, pss-2-1-11 -----> 2)
        const sectionIndex = sectionNum - 1;
        console.log("sectionIndex", sectionIndex);
        // const lastDashIndex = chapterTitle.lastIndexOf("-");
        // console.log("lastDashIndex", lastDashIndex);

        /*
        DB Structure
        keys [array] -> chapterTitle [array] -> title ...... keys [array] -> chapterTitle [array] -> quizzes[]
        keys [sectionIndex] -> chapterTitle[chapterIndex]
        sectionIndex --> pss-2-1-13에서 첫 번호 2-1=1로 결정
        chapterIndex --> pss-2-1-13 에서 끝 번호 3-1=2로 결정
        */

        const chapterNum = chapterTitle.charAt(9);
        // const chapterNum = chapterTitle.substring(lastDashIndex + 1); // extract chapter number(eg. pss-1-7-12 ---> 2) from chapterTitle
        const chapterIndex = chapterNum - 1; // pss-1-1-1 will be stored in array chapterTitle[0]
        console.log("chapterIndex", chapterIndex);
        try {
            // frontend 에서 입력한 chapterTitle이 이미 mongo db에 있는지  찾아 봄
            const question = await Question.findOne({ 'keys.chapterTitle.title': chapterTitle });
            // update the document to add the new quiz to the chapter with the specified chapterTitle
            // 이미 chapterTitle.title (e.g. pss-1-1-1) 이 mongo db에 있는 경우
            if (question) {
                if (chapterIndex > -1) {

                    // 여기에서 문제 발생. chapterTitle[10]이 현재로는 존재하지 않음. chapterTitle에 splice 를 적용해야 하는 데...
                    // question.keys[sectionIndex].chapterTitle[chapterIndex].quizzes.push({ quiz: quiz, correctAnswer: correctAnswer });
                    // if (question.keys[sectionIndex].chapterTitle.length <= chapterIndex) {
                    //     // chapterIndex does not exist, so insert a new element
                    //     question.keys[sectionIndex].chapterTitle.splice(chapterIndex, 0, { quizzes: [] });
                    // }
                    // const newChapterIndex = question.keys[sectionIndex].chapterTitle[chapterIndex].quizzes.length - 1;
                    // console.log("newChapterIndex", newChapterIndex);
                    // push the quiz object into the quizzes array of the specified chapter
                    question.keys[sectionIndex].chapterTitle[chapterIndex].quizzes.push({ quiz: quiz, correctAnswer: correctAnswer });
                    await question.save();
                } else {
                    res.status(400).json({ error: "Invalid chapter title" });
                }
            } else {
                // chapterTitle.title이 mongo db에 없는 경우
                const newChapter = await Question.findById(documentId);
                // create a new object in keys[sectionIndex] array if keys[sectionIndex ] is undefined
                if (!newChapter.keys[sectionIndex]) {
                    newChapter.keys[sectionIndex] = {};
                }
                // newChapter에 chapterTitle push
                newChapter.keys[sectionIndex].chapterTitle.splice(chapterIndex, 0, { title: chapterTitle });
                const titleIndex = newChapter.keys[sectionIndex].chapterTitle.findIndex((element) => element.title === chapterTitle);
                console.log("titleIndex", titleIndex);

                // frontend에서 이미지를 보냈다면 upload it to AWS S3 and get the locaton of S#
                if (typeof req.file != 'undefined') {
                    const image = req.file;
                    // upload imageFile to AWS S3
                    const result = await upload(image);
                    // AWS S3에 저장한 이미지 url을 mongoose model에 push
                    if (result) {
                        // newChapter.keys[sectionIndex].chapterTitle[chapterIndex].s3ImageUrl.push(result.Location); // in case,  the s3ImageUrl is array
                        newChapter.keys[sectionIndex].chapterTitle[titleIndex].s3ImageUrl = result.Location;
                    }
                } else {
                    // frontend에서 보낸 이미지가 없다면.. 
                    console.log("No image to upload")
                }
                // quiz와 correctAnswer를 mongoose model에 push
                newChapter.keys[sectionIndex].chapterTitle[titleIndex].quizzes.push({ quiz: quiz, correctAnswer: correctAnswer });
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