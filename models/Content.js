let mongoose = require("mongoose");
let contentScHema = require("../schemas/content");
//模型类创建
let Tank = mongoose.model("Content",contentScHema);

module.exports= Tank;

