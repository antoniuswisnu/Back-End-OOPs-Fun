const mongoose = require("mongoose");

const LabelQuestion = new mongoose.model(
    "LabelQuestions",
    new mongoose.Schema({
        label:String,
    })
);

module.exports = LabelQuestion;