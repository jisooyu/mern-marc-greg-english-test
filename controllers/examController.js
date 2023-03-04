const asyncHandler = require("express-async-handler");
const Student = require("../models/Student");
const Question = require("../models/Question");
const { upload } = require("./awsController");

// const s3 = require('./awsController');

// @desc    Get student questions
// @route   GET /api/questions
// @access  Private
const getQuestions = asyncHandler(async (req, res, next) => {
  // Get student using the id in the JWT
  // const student = await Student.findById(req.student.id);

  // if (!student) {
  //   res.status(401);
  //   throw new Error("Student not found");
  // }

  // const questions = await Question.find({ student: req.student.id });
  const questions = await Question.find();

  res.status(200).json(questions);
});

// @desc    Get student camp
// @route   GET /api/questions/:id
// @access  Private
const getQuestion = asyncHandler(async (req, res) => {
  // Get student using the id in the JWT
  const student = await Student.findById(req.student.id);

  if (!student) {
    res.status(401);
    throw new Error("Student not found");
  }

  const camp = await Question.findById(req.params.id);

  if (!camp) {
    res.status(404);
    throw new Error("Question not found");
  }

  if (camp.student.toString() !== req.student.id) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  res.status(200).json(camp);
});

// @desc    Create new camp
// @route   POST /api/questions
// @access  Private
const createQuestion = asyncHandler(async (req, res) => {
  const {
    quizz,
    answer,
  } = req.body;

  const image = req.file;

  // Get student using the id in the JWT
  // const student = await Student.findById(req.student.id);
  // if (!student) {
  //   res.status(401);
  //   throw new Error("Student not found");
  // }

  // upload imageFile to AWS S3
  const result = await upload(image);
  console.log("result form campController", result);
  // document creation
  const questionData = await Question.create({
    quizz,
    answer,
    s3ImageUrl: result.Location,
  });
  res.status(201).json(questionData);
});

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
};
