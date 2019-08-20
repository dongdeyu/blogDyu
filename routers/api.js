let express = require('express');
let router  = express.Router();
let User = require("../models/Users");

//统一返回模式
let respinseData;
//初始化
router.use(function (req,res,next) {
    respinseData ={
        code:0,
        message:""
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
router.post("/user/register", function (req,res,next){
    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;
    //用户名是否为空
    if(username == ""){
        respinseData.code = 1;
        respinseData.message = "用户名不能为空";
        res.json(respinseData);
        return;
    }
    //密码是否为空
    if(password == ""){
        respinseData.code = 2;
        respinseData.message = "密码不能为空";
        res.json(respinseData);
        return;
    }
    //两次输入密码不一致
    if(password != repassword){
        respinseData.code = 3;
        respinseData.message = "两次输入密码不一致";
        res.json(respinseData);
        return;
    }
    //用户是否已经被注册了，如果数据库中已经存在和我们要注册的用户名相同的数据，表示用户名已经被注册过了
    User.findOne({
        username:username
    }).then(function (userInfo) {
        if(userInfo){
            //表示数据库中已经有该条记录
            respinseData.code = 4;
            respinseData.message = "用户名已经被注册了";
            res.json(respinseData);
            return;
        }else{
            //保存用户注册的信息到数据库中
            let user = new User({
                username:username,
                password:password
            });
           return user.save();
        }
    }).then(function (newUserInfo) {
        console.log(newUserInfo)
        respinseData.messag = "注册成功";
        res.json(respinseData);
    })

})

//登录接口
router.post("/user/login", function (req,res,next){
    let username = req.body.username;
    let password = req.body.password;
    //用户名是否为空
    if(username == ""||password == ""){
        respinseData.code = 1;
        respinseData.message = "用户名和密码不可为空";
        res.json(respinseData);
        return;
    }
    //从数据库中查询用户名和密码是否一致，如果存在则登录成功
    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if(!userInfo){
            respinseData.code =2;
            respinseData.message = "用户名或密码错误";
            res.json(respinseData);
            return;
        }else{
            //用户名和密码正确 登录成功
            respinseData.message = "登录成功";
            respinseData.userInfo={
                id:userInfo.id,
                username:userInfo.username
            }
            req.cookies.set("userInfo",JSON.stringify({
                _id:userInfo._id,
                username:userInfo.username
            }));
            res.json(respinseData);
            return;
        }
    })

})

//退出接口
router.get("/user/logout", function (req,res,next){
    console.log(11)
    req.cookies.set("userInfo",null);
    respinseData.message = "退出成功";
    res.json(respinseData);
})

module.exports = router;
