let mongoose = require("mongoose");
let ownScHema = require("../schemas/own");
//模型类创建
let Tank = mongoose.model("Own",ownScHema);

module.exports= Tank;

