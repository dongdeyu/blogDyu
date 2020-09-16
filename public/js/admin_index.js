$(function(){
    // 表单提交
    $("#admin_btn").click(function(){
        if($(".username").val()==""){
            layer.msg("请输入用户名");
            return false
        }
        if($(".password").val()==""){
            layer.msg("请输入密码");
            return false
        }
        $.ajax({
            type: "post",
            url: "/admin/login",
            data: {
                username: $(".username").val(),
                password: $(".password").val(),
            
            },
            dataType: 'json',
            success: function (result) {
                if(result.code==0){
                    window,location.href ='/admin'
                }
               console.log(result)
            },
            error: function (error) {
                console.log(error)
            }
        })
    })
})