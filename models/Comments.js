let mongoose = require("mongoose");
let commentsScHema = require("../schemas/comments");
//模型类创建
let Tank = mongoose.model("Comments",commentsScHema);

module.exports= Tank;

