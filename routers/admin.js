let express = require('express');
let router  = express.Router();
let User = require("../models/Users")
let Category = require("../models/Category")
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
    let page = Number(req.query.page || 1);
    const limit = 2;
    let pages = 0;
    //查询数据库的总条数 用count方法
    User.count().then(function(count){
        //计算总页数
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        let skip = (page-1) *limit;
        User.find().limit(limit).skip(skip).then(function (users) {
            console.log()
            res.render("admin/user_index",{
                userInfo:req.userInfo,
                users:users,
                count:count,
                pages:pages,
                limit:limit,
                page:page,
                router:"user"
            });
        });
    })


})

/*
* 分类路由
* */
router.get("/category",function (req,res,next) {
    let page = Number(req.query.page || 1);
    const limit = 2;
    let pages = 0;
    //查询数据库的总条数 用count方法
    Category.count().then(function(count){
        //计算总页数
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        let skip = (page-1) *limit;
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function (categories) {
            res.render("admin/category_index",{
                userInfo:req.userInfo,
                categories:categories,
                count:count,
                pages:pages,
                limit:limit,
                page:page,
                router:"category"
            });
        });
    })

})

/*
* 添加分类页面
* */
router.get("/category/add",function (req,res,next) {
    res.render("admin/category_add",{
        userInfo:req.userInfo
    })
})

/*
* 添加分类提交按钮post方式
* */
router.post("/category/add",function (req,res) {
    let name = req.body.name;
    if(name==""){
        res.render("admin/error",{
            userInfo:req.userInfo,
            message:"名称不能为空"
        })
        return
    }
    //数据库中是否已经存在同名的分类名称
    Category.findOne({name:name}).then(function (rs) {
        if(rs){
            //数据库中已经存在该分类
            res.render("admin/error",{
                userInfo:req.userInfo,
                message:"分类已经存在"
            })
            return Promise.reject();
        }else{
            //数据库中不存在该分类 可以保存
            return new Category({
                name:name
            }).save();
        }
    }).then(function (newCategory) {
        res.render("admin/success",{
            userInfo:req.userInfo,
            message:"分类保存成功",
            url:"/admin/category"
        })
    })
})


/*
* 添加分类页面
* */
router.get("/category/edit",function (req,res,next) {
    //获取要修改的分类的信息，
    let id = req.query.id  || "";
    let name =  req.body.name  || "";
    Category.findOne({_id:id}).then(function (category) {
        console.log(category)
        //找不到id
        if(!category){
            res.render("admin/error",{
                userInfo:req.userInfo,
                message:"分类信息不存在"
            })
        }else{
            //当用户没有做任何的修改的时候
            res.render("admin/category_edit",{
                userInfo:req.userInfo,
                category:category
            })
            //要修改的分类名称是否在数据库中存在

        }
    })
})


/*
* 编辑保存post
* */

router.post("/category/edit",function (req,res) {
    let name = req.body.name || "";
    let id = req.query.id || "";
    Category.findOne({_id:id}).then(function (category) {
        //找不到id
        if(!category){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        }else{
            //当用户没有做任何的修改的时候
            if(name==category.name){
                res.render("admin/success",{
                    userInfo:req.userInfo,
                    message:"修改成功",
                    url:"/admin/category"
                })
                return Promise.reject();
            }else{
                //要修改的分类名称是否在数据库中存在
                return  Category.findOne({
                    _id: {$ne: id},
                    name: name})
            }
        }
    }).then(function (sameCatetory) {
        if(sameCatetory){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类'
            });
            return Promise.reject();
        }else{
            return Category.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    })
})

/*
* 分类删除
* */
router.get("/category/delete",function (req,res) {
    let id = req.query.id || "";
    Category.remove({_id:id}).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url:"/admin/category"
        });
    })
})





module.exports = router;
