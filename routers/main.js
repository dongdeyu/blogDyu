let express = require('express');
let router = express.Router();
let Category = require("../models/Category")
let Content = require("../models/Content")
let data;
//处理通用的信息
router.use(function (req,res,next) {
    data={
        userInfo:req.userInfo,
        categories:[],
    }
    Category.find().then(function (categories) {
        //读取分类信息
        data.categories = categories;
        next();
    })
})

//首页
router.get("/", function (req, res, next) {
    data.category = req.query.category || "";
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 5;
    data.pages = 0;
    let where={};
    console.log(data.category)
    if(data.category){
        where.category = data.category;
    }
    Content.count().where(where).then(function (count) {
        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min(data.page, data.pages);
        //取值不能小于1
        data.page = Math.max(data.page, 1);
        let skip = (data.page - 1) * data.limit;
        console.log(where)
        return Content.where(where).find().limit(data.limit).skip(skip).populate(["category","user"]).sort({addTime:-1});
    }).then(function (contents) {
        data.contents= contents;
        console.log(data)
        res.render("main/index",data);
    })

})
router.get("/views", function (req, res, next) {
    res.send("views");
})
module.exports = router;
