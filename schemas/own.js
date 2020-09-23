let mongoose = require("mongoose");

//用户的表结构
let ownSchema = new mongoose.Schema({
    title: String,
    reviewTime: Date,
    url: String,
    contentInfo:String,
    contentDetail:String,
});
module.exports= ownSchema;
