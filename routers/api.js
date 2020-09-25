let express = require('express');
let router = express.Router();
let User = require("../models/Users");
let Content = require('../models/Content');
let Comments = require('../models/Comments');
let Own = require('../models/Own');

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
                password: password,
                sex:'男',
                logo:'',
                email:''
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
    console.log(9999)
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
                username: userInfo.username,
                email:userInfo.email,
                logo:userInfo.logo,
                sex:userInfo.sex,
            }
            req.cookies.set("userInfo", JSON.stringify({
                _id: userInfo._id,
                username: userInfo.username,
                sex:userInfo.sex,
                logo:userInfo.logo,
                email:userInfo.email,
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
    //查询当前这篇内容的信息
    Content.findOne({
        _id: contentId
    }).then(function (content) {
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
    if (req.userInfo.username) {
        let comments = new Comments({
            username: req.userInfo.username,
            reviewTime: new Date(),
            content: req.body.content
        });
        comments.save();
        responseData.message = '评论成功';
        responseData.code = 2000;
        res.json(responseData);
    } else {
        responseData.message = '请登录后评论';
        responseData.code = 4;
        res.json(responseData);
    }

});
// 留言板功能(查询)
router.post('/getCommentsLists', function (req, res) {
    let page = Number(req.body.pageSize || 1);
    const limit = 10;
    let pages = 0;
    let allUsers = 0; //参与的总人数
    Comments.count().then(function (count) {
        pages = Math.ceil(count / limit) == 0 ? 1 : Math.ceil(count / limit);
        let skip = (page - 1) * limit;
        let obj = {};
        Comments.find().then(function (data) {
            allUsers = data.reduce((cur, next) => {
                obj[next.username] ? "" : obj[next.username] = true && cur.push(next);
                return cur;
            }, []).length //设置cur默认类型为数组，并且初始值为空的数组
        }).then(function () {
            Comments.find().limit(limit).skip(skip).sort({"reviewTime":-1}).then(function (users) {
                responseData.message = '查询成功';
                responseData.code = 2000;
                // 如果传入的总页数大于查询出来的总页数 应该返回空数组
                if (page > pages) {
                    users = [] 
                }
                responseData.data = {
                    count: count,
                    pages: pages,
                    datas: users,
                    allUsers: allUsers
                }
                res.json(responseData);
            })
        })

    })
});

router.post('/getOwnLists',function(req,res){
    let page = Number(req.body.pageSize || 1);
    const limit = 5;
    let pages = 0;
    //查询数据库的总条数 用count方法
    Own.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        let skip = (page - 1) * limit;
        console.log(skip)
        Own.find().sort({ _id: -1 }).limit(limit).skip(skip).sort({ reviewTime: 1 }).then(function (contents) {
            responseData.code = 2000;
            responseData.data = {
                count: count,
                pages: pages,
                datas: contents,
                
            }
            res.json(responseData);
        });
    })
})


router.post('/setUserInfo',function(req, res){
    console.log(999)
    console.log(req.body)
})
module.exports = router;
