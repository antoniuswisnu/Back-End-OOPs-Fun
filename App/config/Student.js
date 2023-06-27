const mongoose = require("mongoose");

const Student = new mongoose.model(
    "Student",
    new mongoose.Schema({
        email:String,
        name:String,
        roles:String,
        grade:{
            type:Number,
            default:0,
        },
        class:{
            type: mongoose.Schema.Types.String,
            ref:"Class",
            default:null,
        },
        level:{
            type:Number,
            default:1,
        },
        experience:{
            type:Number,
            default:0,
        },
    })
);

module.exports = Student;