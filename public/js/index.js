/**
 * Created by ddyu.
 */

$(function() {
    let  $loginBox = $("#loginBox");
    let  $registerBox = $("#registerBox");
    let  $userInfo =$("#userInfo")
    //切换
    $loginBox.find("a").on('click',function () {
        $loginBox.hide();
        $registerBox.show()
    })
    //切换
    $registerBox.find("a").on('click',function () {
        $registerBox.hide();
        $loginBox.show()
    })
    //注册提交按钮
    $registerBox.find("button").on('click',function () {
        $.ajax({
            type:"post",
            url:"/api/user/register",
            data:{
                username:$registerBox.find("[name=username]").val(),
                password:$registerBox.find("[name=password]").val(),
                repassword:$registerBox.find("[name=repassword]").val(),
            },
            dataType:'json',
            success:function (result) {
                $registerBox.find(".colWarning").html(result.message)
                if (!result.code){
                    $loginBox.show();
                    $registerBox.hide()
                }
                console.log(result)
            }
        })
    })
    //登录按钮提交事件
    $loginBox.find("button").on('click',function () {
        $.ajax({
            type:"post",
            url:"/api/user/login",
            data:{
                username:$loginBox.find("[name=username]").val(),
                password:$loginBox.find("[name=password]").val(),
            },
            dataType:'json',
            success:function (result) {
                $loginBox.find(".colWarning").html(result.message)
                if(!result.code){
                   window.location.reload()
                }
            }
        })
    })

    //退出提交事件
    $("#logout").on("click",function () {
        console.log(1111)
        $.ajax({
            url:"/api/user/logout",
            success:function (result) {
                if(!result.code){
                    window.location.reload();
                }
            }
        })
    })
})
