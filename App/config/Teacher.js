const mongoose = require("mongoose");

const Teacher = new mongoose.model(
    "Teacher",
    new mongoose.Schema({
        email:String,
        name:String,
        roles:String,
    })
);

module.exports = Teacher;