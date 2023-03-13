const express = require('express');
const multer = require('multer');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require("../controllers/awsController");
const { check, validationResult } = require('express-validator');

const Question = require('../models/Question');
// multer middleware
const multerUpload = multer({ dest: 'uploads/' });

// helper function for route GET
const getQuestion = async (title, keysIndex = 0, chapterIndex = 0) => {
    try {
        const query = { 'keys.chapterTitle.title': title };
        const projection = { keys: 1 };
        const questions = await Question.find(query, projection);
        const filteredKeys = questions[0].keys[0].chapterTitle.filter((key, index) => {
            return key.title === title;
        });
        return filteredKeys;
    } catch (error) {
        console.log(error.message);
        throw new Error('Server Error');
    }
};
// route GET
router.get('/:title', async (req, res) => {
    try {
        const keysIndex = Number(req.query.keysIndex) || 0;
        const chapterIndex = Number(req.query.chapterIndex) || 0;
        const questions = await getQuestion(req.params.title, keysIndex, chapterIndex);
        res.json(questions);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});

// route: POST 
router.post('/', multerUpload.single('imageFile'),
    [check('chapterTitle', 'chapter title is required').not().isEmpty(),
    check('quiz', 'quiz is required').not().isEmpty(),
    check('correctAnswer', 'Answer is required').not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log("req.body from router.post ", req.body);
        const { chapterTitle, quiz, correctAnswer } = req.body;
        const sectionNum = chapterTitle.charAt(4); // extract sectoin number (e.g. pss-1-4-5 ----> 1, pss-2-1-11 -----> 2)
        const sectionIndex = sectionNum - 1;
        // console.log("sectionIndex", sectionIndex);
        /*
        DB Structure
        최상위: collection [documentIndex]
        keys [array] -> chapterTitle [array] -> title 혹은 keys [array] -> chapterTitle [array] -> keys[]
        keys [sectionIndex] -> chapterTitle[chapterIndex]
        sectionIndex --> pss-2-1-13에서 첫 번호 2-1=1로 결정
        chapterIndex --> pss-2-1-13 에서 끝 번호 3-1=2로 결정
        */
        const getDocumentId = async () => {
            try {
                const result = await Question.findOne({}, { _id: 1 });
                return result._id.toString();
            } catch (error) {
                throw error;
            }
        };
        const documentId = await getDocumentId();
        // console.log("documentId", documentId);
        const chapterNum = chapterTitle.charAt(9);
        const chapterIndex = chapterNum - 1; // pss-1-1-1 will be stored in array chapterTitle[0]
        // console.log("chapterIndex", chapterIndex);
        try {
            // frontend 에서 입력한 chapterTitle이 이미 mongo db에 있는지  찾아 봄
            const question = await Question.findOne({ 'keys.chapterTitle.title': chapterTitle });
            // update the document to add the new quiz to the chapter with the specified chapterTitle
            // 이미 chapterTitle.title (e.g. pss-1-1-1) 이 mongo db에 있는 경우
            if (question) {
                if (chapterIndex > -1) {
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

router.put('/edit/:id', multerUpload.single('imageFile'),
    async (req, res) => {
        console.log("req.body from router.post ", req.body);
        const { quizId } = req.params; // edit 하려고 하는 quiz의 id
        /* 
        collection [documentId] -> keys[sectionId] -> chapterTitle[chapterId]->quizzes[quizzId]
        quizId가 React JS에서 오면 이를 갖고 quizzes[quizzId]를 찾아야 함.
        어떻게 quizzes[quizzId]를 찾을 수 있지?
        잠깐...
        
        1. React에서 edit 하고자 하는 quiz를 click하면 
        quiz 의 id가 node js get으로 보내지고..
        2. node js get은 id에 해당하는 quiz data를 react 로 보내고
        3. react는 이 데이터를 React form에 display를 하면
        4. 이를 수정하여 다시 node js의 put으로 보냄

        해당 quiz의 내용이 EditQuestionForm.js에 나타나야 함. 그리고 이를 수정해서 submit하면 수정내용을 node js /edit/:id로 보내야 함.
        
        */
        const { chapterTitle, quiz, correctAnswer } = req.body;
        const sectionNum = chapterTitle.charAt(4); // extract sectoin number (e.g. pss-1-4-5 ----> 1, pss-2-1-11 -----> 2)
        const sectionIndex = sectionNum - 1;
        const getDocumentId = async () => {
            try {
                const result = await Question.findOne({}, { _id: 1 });
                return result._id.toString();
            } catch (error) {
                throw error;
            }
        };
        const documentId = await getDocumentId();
        const chapterNum = chapterTitle.charAt(9);
        const chapterIndex = chapterNum - 1; // pss-1-1-1 will be stored in array chapterTitle[0]
        try {
            const newChapter = await Question.findById(documentId);
            // create a new object in keys[sectionIndex] array if keys[sectionIndex ] is undefined
            if (!newChapter.keys[sectionIndex]) {
                newChapter.keys[sectionIndex] = {};
            }
            // newChapter에 chapterTitle push
            newChapter.keys[sectionIndex].chapterTitle.splice(chapterIndex, 0, { title: chapterTitle });
            const titleIndex = newChapter.keys[sectionIndex].chapterTitle.findIndex((element) => element.title === chapterTitle);
            // frontend에서 이미지를 보냈다면 upload it to AWS S3 and get the locaton of S3
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
            res.status(200).json({ message: "Quizzes saved successfully" })
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: "Server Error from question.js" })
        }
    }
);
module.exports = router;