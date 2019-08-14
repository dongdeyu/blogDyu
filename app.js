/**
 * created by dyu
 * 应用程序的启动文件(入口文件)
 */
//加载express
let express = require('express');

//加载模板处理模块
let swig = require("swig");

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
* 首页
*   req request对象
*   res response对象
*   next 函数
* */

app.get("/",function (req,res,next) {
    // res.send("<h1>呵呵你好啊2</h1>") 不这么写 换成render的读取方法
    /*
    * 读取views目录下的指定文件,解析并返回给客户端
    * 第一个参数：表示模板的文件，相对于views  views/index.html
    * 第二个参数：传递给模板使用的数据
    * */
    res.render("index")
})

//监听http请求
app.listen(8888);




