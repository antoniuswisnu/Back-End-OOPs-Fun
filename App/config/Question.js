const mongoose = require("mongoose");

const Question = new mongoose.model(
    "Question",
    new mongoose.Schema({
        question:String,
        option1:String,
        option2:String,
        option3:String,
        option4:String,
        option5:String,
        correctAnswer:String,
        label:{
            type:mongoose.Schema.Types.String,
            ref:"LabelQuestions",
        },
        keyLabel:{
            type:mongoose.Schema.Types.String
        }
    })
);

module.exports = Question;