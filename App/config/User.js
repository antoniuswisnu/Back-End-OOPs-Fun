const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        name:String,
        email:String,
        password:String,
        roles:String
    })
);
module.exports = User;