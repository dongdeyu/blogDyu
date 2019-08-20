let express = require('express');
let router  = express.Router();
let User = require("../models/Users")
router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
     //非管理员用户
        res.send("对不起，只有管理员才能进入后台页面");
        return;
    }
    next();
})
router.get("/", function (req,res,next){
    res.render("admin/index",{
        userInfo:req.userInfo
    });
})
/*
* 用户管理
* */
router.get("/user", function (req,res,next){
    /*
    * 从数据库中读取所有的用户资料
    *
    * limit(Number):限制获取的条数
    * skip(2):忽略数据的条数
    *
    * 每页显示两条
    * 1:1-2 skip:0 => 当前页 -1 * limit
    * 2:3-4 skip:2
    * */
    const page = Number(req.query.page || 1);
    const limit = 2;
    const skip = (page-1) *limit;
    User.find().limit(limit).skip(skip).then(function (users) {
        console.log()
        res.render("admin/user_index",{
            userInfo:req.userInfo,
            users:users,
        });
    });

})

module.exports = router;
