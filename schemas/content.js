let mongoose = require("mongoose");

//用户的表结构
module.exports= new mongoose.Schema({
    //关联字段 - 分类的id
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用(另外一张表的模型)
        ref:"Category"
    },
    //关联字段 - 用户id
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用(另外一张表的模型)
        ref:"User"
    },
    addTime:{
        type:Date,
        default:new Date()
    },
    views:{
        type:Number,
        default:0
    },
    //内容标题
    title:String,
    //简介
    description:{
        type: String,
        default:""
    },
    //内容
    content:{
        type: String,
        default:""
    }
})
