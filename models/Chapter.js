const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapterSchema = Schema({
    chapterId: {
        type: ObjectId,
        required: true
    },
    numQuestions: {
        type: Number,
        required: true
    }
});

module.export = mongoose.model('Chapter', chapterSchema);