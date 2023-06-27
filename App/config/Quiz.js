const mongoose = require("mongoose");

const Quiz = new mongoose.model(
  "Quiz",
  new mongoose.Schema({
    keyClass: String,
    nameQuiz: String,
    listQuestion: [],
    levelMinimum: {
      type: Number,
      default: 0,
    },
  })
);

module.exports = Quiz;
