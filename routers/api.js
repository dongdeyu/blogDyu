let express = require('express');
let router = express.Router();
let User = require("../models/Users");
let Content = require('../models/Content');
let Comments = require('../models/Comments');


//统一返回模式
let responseData;
//初始化
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ""
    }
    next();
})

/*
* 注册逻辑
* 1.用户名不能为空
* 2.密码不能为空
* 3.两次输入密码必须一致
* */
/*
* 查询数据库的
* 1.用户是否已经被注册
* */
//注册接口
router.post("/user/register", function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;
    //用户名是否为空
    if (username == "") {
        responseData.code = 1;
        responseData.message = "用户名不能为空";
        res.json(responseData);
        return;
    }
    //密码是否为空
    if (password == "") {
        responseData.code = 2;
        responseData.message = "密码不能为空";
        res.json(responseData);
        return;
    }
    //两次输入密码不一致
    if (password != repassword) {
        responseData.code = 3;
        responseData.message = "两次输入密码不一致";
        res.json(responseData);
        return;
    }
    //用户是否已经被注册了，如果数据库中已经存在和我们要注册的用户名相同的数据，表示用户名已经被注册过了
    User.findOne({
        username: username
    }).then(function (userInfo) {
        if (userInfo) {
            //表示数据库中已经有该条记录
            responseData.code = 4;
            responseData.message = "用户名已经被注册了";
            res.json(responseData);
            return;
        } else {
            //保存用户注册的信息到数据库中
            let user = new User({
                username: username,
                password: password
            });
            return user.save();
        }
    }).then(function (newUserInfo) {
        responseData.messag = "注册成功";
        res.json(responseData);
    })

})

//登录接口
router.post("/user/login", function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    //用户名是否为空
    if (username == "" || password == "") {
        responseData.code = 1;
        responseData.message = "用户名和密码不可为空";
        res.json(responseData);
        return;
    }
    //从数据库中查询用户名和密码是否一致，如果存在则登录成功
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = "用户名或密码错误";
            res.json(responseData);
            return;
        } else {
            //用户名和密码正确 登录成功
            responseData.message = "登录成功";
            responseData.userInfo = {
                id: userInfo.id,
                username: userInfo.username
            }
            req.cookies.set("userInfo", JSON.stringify({
                _id: userInfo._id,
                username: userInfo.username
            }));
            res.json(responseData);
            return;
        }
    })

})

//退出接口
router.get("/user/logout", function (req, res, next) {
    req.cookies.set("userInfo", null);
    responseData.message = "退出成功";
    res.json(responseData);
})

/*
* 评论提交
* */
router.post('/comment/post', function (req, res) {
    //内容的id
    let contentId = req.body.contentid || '';

    let postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    };
    console.log(postData)
    //查询当前这篇内容的信息
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        console.log(content.comments)
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message = '评论成功';
        responseData.data = newContent;
        res.json(responseData);
    });
});


/*
* 获取指定文章的所有评论
* */
router.get('/comment', function (req, res) {
    let contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        responseData.data = content.comments;
        res.json(responseData);
    })
});

// 留言板功能(添加)
router.post('/addComments', function (req, res) {
    let comments = new Comments({
        username: req.userInfo.username,
        reviewTime: Date.now(),
        content: req.body.content
    });
    comments.save();
    responseData.message = '评论成功';
    responseData.code = 2000;
    res.json(responseData);
});
// 留言板功能(查询)
router.post('/getCommentsLists', function (req, res) {
    let page = Number(req.body.pageSize || 1);
    // console.log(req.body.pageSize)
    let prewCount = req.body.pageSize==1?0:req.body.pageSize*10-10+1;
    let nextCount = req.body.pageSize==1?10:req.body.pageSize*10+1;
    Comments.count().then(function (count) {
        // const limit = 10;
        // pages = Math.ceil(count / 10);
        // //取值不能超过pages
        // page = Math.min(page, pages);
        // Math.ceil(count / limit)
        console.log(nextCount)
        console.log(prewCount)
        Comments.find().limit(nextCount).skip(prewCount).then(function (users) {
            console.log(users)
        })
    })
    // //计算总页数
    // pages = Math.ceil(count / limit);
    // //取值不能超过pages
    // page = Math.min(page, pages);
    // //取值不能小于1
    // page = Math.max(page, 1);
    // let skip = (page - 1) * limit;
    // User.find().limit(limit).skip(skip).then(function (users) {
    //     console.log()
    //     res.render("admin/user_index", {
    //         userInfo: req.userInfo,
    //         users: users,
    //         count: count,
    //         pages: pages,
    //         limit: limit,
    //         page: page,
    //         router: "user"
    //     });
    // });



});
module.exports = router;
