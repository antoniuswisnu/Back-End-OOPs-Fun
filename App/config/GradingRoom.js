const mongoose = require("mongoose");

const GradingRoom = new mongoose.model(
    "GradingRoom",
    new mongoose.Schema({
        userID:String,
        quizID:String,
        attempt:{
            type:Number,
            default:0,
        },
        grade:{
            type:Number,
            default:0,
        }
    })
);

module.exports = GradingRoom;