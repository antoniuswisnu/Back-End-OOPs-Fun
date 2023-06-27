const mongoose = require("mongoose");

const Class = new mongoose.model(
    "Class",
    new mongoose.Schema({
        class: String,
        token: String,
    })
);

module.exports = Class;