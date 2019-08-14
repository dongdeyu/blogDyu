let mongoose = require("mongoose");
let usersScHema = require("../schemas/users");
//模型类创建
let Tank = mongoose.model("User",usersScHema);

module.exports= Tank;

