let mongoose = require("mongoose");

//用户的表结构
let commentsSchema = new mongoose.Schema({
    username: String,
    reviewTime: Date,
    content: String
});
module.exports= commentsSchema;
