$(function(){
    if ($("#myId2").val() == 1) {
        $("#sex").find('input').eq(0).attr("checked", "checked")
    } else {
        $("#sex").find('input').eq(1).attr("checked", "checked")
    }
})


$(".buttons-sub").click(function () {
    var url = $("#headImg")[0].src
    if ($("#username").val() == "") {
        layer.msg("请输入昵称");
        return false
    }
    if ($("#email").val() == "") {
        layer.msg("请输入邮箱");
        return false
    }
    if (url == "") {
        layer.msg("请上传头像");
        return false
    } 
    if (!regEmail.test($("#email").val())) {
        layer.msg("请输入正确的邮箱");
        return false
    }
    $.ajax({
        type: "post",
        url: "/api/setUserInfo",
        data: {
            username: $("#username").val(),
            email: $("#email").val(),
            sex: $("#sex").find("input:checked").val(),
            logo: url,
            id: $("#myId").val()
        },
        dataType: 'json',
        success: function (result) {
            if (result.code == 10000) {
                window.location.reload()
            }
        },
        error: function (error) {
            console.log(error)
        }
    })
})
var client = new OSS.Wrapper({
    // region: 'oss-cn-beijing',
    // accessKeyId: 'LTAI4G1JtCSQop12y2EFAjiv',
    // accessKeySecret: 'gGg3RYltVfDF2UAsijIdtcCq0a9Mij',
    // bucket: 'dongdeyu',
    // secure: true
});
function uploadPic(obj) {
    var file = obj.files[0];//获取文件流
    var val = obj.value;
    var suffix = val.substr(val.indexOf("."));
    var storeAs = 'blog/' + timestamp() + suffix;
    client.multipartUpload(storeAs, file).then(function (result) {
        var options = { expires: 10000000 }; //options可以传入链接的失效时间
        url = client.signatureUrl(result.name, options);
        $(".Infolists img").attr("src", url)
        console.log(url)
        // 获取url后直接走接口将url传给node 保存在数据库中        
    }).catch(function (err) {
        console.log(err);
    });
}