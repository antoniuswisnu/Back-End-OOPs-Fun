const mongoose = require("mongoose");
// mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://127.0.0.1:27017/pad2`)
.then(() =>{
    console.log("Successfully connected to mongoDB");
})
.catch(err => {
    console.error("connection error", err);
    process.exit();
});
