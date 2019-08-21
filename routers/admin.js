let express = require('express');
let router = express.Router();
let User = require("../models/Users")
let Category = require("../models/Category")
let Content = require("../models/Content")
//判断是否是管理员进入后台页面
router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        //非管理员用户
        res.send("对不起，只有管理员才能进入后台页面");
        return;
    }
    next();
})

//首页跳转
router.get("/", function (req, res, next) {
    res.render("admin/index", {
        userInfo: req.userInfo
    });
})

/*
* 用户管理
* */
router.get("/user", function (req, res, next) {
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
    const limit = 10;
    let pages = 0;
    //查询数据库的总条数 用count方法
    User.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        let skip = (page - 1) * limit;
        User.find().limit(limit).skip(skip).then(function (users) {
            console.log()
            res.render("admin/user_index", {
                userInfo: req.userInfo,
                users: users,
                count: count,
                pages: pages,
                limit: limit,
                page: page,
                router: "user"
            });
        });
    })


})

/*
* 分类路由
* */
router.get("/category", function (req, res, next) {
    let page = Number(req.query.page || 1);
    const limit = 10;
    let pages = 0;
    //查询数据库的总条数 用count方法
    Category.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        let skip = (page - 1) * limit;
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {
            res.render("admin/category_index", {
                userInfo: req.userInfo,
                categories: categories,
                count: count,
                pages: pages,
                limit: limit,
                page: page,
                router: "category"
            });
        });
    })

})

/*
* 添加分类页面
* */
router.get("/category/add", function (req, res, next) {
    res.render("admin/category_add", {
        userInfo: req.userInfo
    })
})

/*
* 添加分类提交按钮post方式
* */
router.post("/category/add", function (req, res) {
    let name = req.body.name;
    if (name == "") {
        res.render("admin/error", {
            userInfo: req.userInfo,
            message: "名称不能为空"
        })
        return
    }
    //数据库中是否已经存在同名的分类名称
    Category.findOne({name: name}).then(function (rs) {
        if (rs) {
            //数据库中已经存在该分类
            res.render("admin/error", {
                userInfo: req.userInfo,
                message: "分类已经存在"
            })
            return Promise.reject();
        } else {
            //数据库中不存在该分类 可以保存
            return new Category({
                name: name
            }).save();
        }
    }).then(function (newCategory) {
        res.render("admin/success", {
            userInfo: req.userInfo,
            message: "分类保存成功",
            url: "/admin/category"
        })
    })
})


/*
* 添加分类页面
* */
router.get("/category/edit", function (req, res, next) {
    //获取要修改的分类的信息，
    let id = req.query.id || "";
    let name = req.body.name || "";
    Category.findOne({_id: id}).then(function (category) {
        console.log(category)
        //找不到id
        if (!category) {
            res.render("admin/error", {
                userInfo: req.userInfo,
                message: "分类信息不存在"
            })
        } else {
            //当用户没有做任何的修改的时候
            res.render("admin/category_edit", {
                userInfo: req.userInfo,
                category: category
            })
            //要修改的分类名称是否在数据库中存在

        }
    })
})


/*
* 编辑保存提交
* */

router.post("/category/edit", function (req, res) {
    let name = req.body.name || "";
    let id = req.query.id || "";
    Category.findOne({_id: id}).then(function (category) {
        //找不到id
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            //当用户没有做任何的修改的时候
            if (name == category.name) {
                res.render("admin/success", {
                    userInfo: req.userInfo,
                    message: "修改成功",
                    url: "/admin/category"
                })
                return Promise.reject();
            } else {
                //要修改的分类名称是否在数据库中存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                })
            }
        }
    }).then(function (sameCatetory) {
        if (sameCatetory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类'
            });
            return Promise.reject();
        } else {
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
* 分类删除提交
* */
router.get("/category/delete", function (req, res) {
    let id = req.query.id || "";
    Category.remove({_id: id}).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: "/admin/category"
        });
    })
})

/*
* 内容列表页面
* */
router.get("/content", function (req, res) {
    let page = Number(req.query.page || 1);
    const limit = 10;
    let pages = 0;
    //查询数据库的总条数 用count方法
    Content.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        let skip = (page - 1) * limit;
        Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(["category","user"]).sort({addTime:-1}).then(function (contents) {
            console.log(contents)
            res.render("admin/content_index", {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                pages: pages,
                limit: limit,
                page: page,
                router: "content"
            });
        });
    })


})

/*
* 内容添加页面
* */
router.get("/content/add", function (req, res) {
    Category.find().sort({_id: -1}).then(function (categories) {
        res.render("admin/content_add", {
            userInfo: req.userInfo,
            categories: categories
        })
    })

})

/*
* 内容保存
* */
router.post("/content/add", function (req, res) {
    if (req.body.title == "") {
        res.render("admin/error", {
            userInfo: req.userInfo,
            message: "分类标题不能为空"
        })
        return
    }
    if (req.body.description == "") {
        res.render("admin/error", {
            userInfo: req.userInfo,
            message: "简介不能为空"
        })
        return
    }
    if (req.body.content == "") {
        res.render("admin/error", {
            userInfo: req.userInfo,
            message: "内容不能为空"
        })
        return
    }
    new Content({
        category: req.body.category,
        title: req.body.title,
        user:req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content,
    }).save().then(function (rs) {
        res.render("admin/success", {
            userInfo: req.userInfo,
            message: "内容保存成功",
            url: "/admin/content"
        })
    });
})


/*
* 内容修改页面
* */
router.get("/content/edit", function (req, res) {
    let id = req.query.id || "";
    let categories = []
    Category.find().sort({_id: -1}).then(function (rs) {
        categories = rs
        return Content.findOne({_id: id}).populate("category")
    }).then(function (content) {
        console.log(content)
        if (!content) {
            res.render("admin/error", {
                userInfo: req.userInfo,
                message: "指定内容不存在"
            })
            return Promise.reject()
        } else {
            res.render("admin/content_edit", {
                userInfo: req.userInfo,
                categories:categories,
                content: content
            })
        }
    })

})

/*
* 内容修改提交
* */
router.post("/content/edit", function (req, res) {
    let id = req.query.id || "";
    if (req.body.title == "") {
        res.render("admin/error", {
            userInfo: req.userInfo,
            message: "分类标题不能为空"
        })
        return
    }
    if (req.body.description == "") {
        res.render("admin/error", {
            userInfo: req.userInfo,
            message: "简介不能为空"
        })
        return
    }
    if (req.body.content == "") {
        res.render("admin/error", {
            userInfo: req.userInfo,
            message: "内容不能为空"
        })
        return
    }
     Content.update({
        _id:id
     },{
         category: req.body.category,
         title: req.body.title,
         description: req.body.description,
         content: req.body.content,
     }).then(function () {
         res.render("admin/success", {
             userInfo: req.userInfo,
             message: '修改成功',
             url: '/admin/content'
         })
     })
})

/*
* 内容删除提交
* */
router.get("/content/delete", function (req, res) {
    let id = req.query.id || "";
    Content.remove({_id: id}).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: "/admin/content"
        });
    })
})

module.exports = router;
