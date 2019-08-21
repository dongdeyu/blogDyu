let express = require('express');
let router  = express.Router();
let Category = require("../models/Category")
router.get("/", function (req,res,next){
    Category.find().then(function (categories) {
       //读取分类信息
        console.log(categories)
        res.render("main/index",{
            userInfo:req.userInfo,
            categories:categories
        });
    })

})
router.get("/views", function (req,res,next){
    res.send("views");
})
module.exports = router;
