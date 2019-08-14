/**
 * created by dyu
 * 应用程序的启动文件(入口文件)
 */
//加载express
let express = require('express');

//加载模板处理模块
let swig = require("swig");

//加载数据库模块
let mongoose = require("mongoose");

//创建app应用 => NodeJs Http.createServer();
let app = express();

//设置静态文件托管
//当用户访问的url以 /public 开始，那么直接返回对应的 __dirname+"/public" 下的文件
app.use("/public",express.static(__dirname+"/public"))

//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数:模板引擎的名称，同时也是模板文件的后缀；第二个参数表示用于解析处理模板内容的方法
app.engine("html",swig.renderFile);

//设置模板文件存放的目录，第一个参数必须是views； 第二个参数是路径（目录）
app.set("views", "./views")

//注册所使用的模板引擎，第一个参数必须是view engine；第二个参数和app.engine这个方法定义的模板引擎的名称（第一个参数）是一致的
app.set("view engine", "html")

//在开发过程当中，需要取消模板缓存
swig.setDefaults({cache: false})

/*
* 根据不同的功能划分模块
* */
app.use("/admin", require('./routers/admin'))
app.use("/api", require('./routers/api'))
app.use("/", require('./routers/main'))

//监听http请求
mongoose.connect("mongodb://localhost:27018/blog",function (err) {
    if (err){
        console.log("连接数据库")
    }else{
        console.log("数据库连接成功")
        app.listen(8089);
    }
})




