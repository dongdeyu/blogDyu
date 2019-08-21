let mongoose = require("mongoose");
let categoriesScHema = require("../schemas/categories");
//模型类创建
let Tank2 = mongoose.model("Category",categoriesScHema);

module.exports= Tank2;

