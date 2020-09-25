var url = ''
var client = new OSS.Wrapper({
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAI4G1JtCSQop12y2EFAjiv',
    accessKeySecret: 'gGg3RYltVfDF2UAsijIdtcCq0a9Mij',
    bucket: 'dongdeyu',
    secure: true
});

function uploadPic(obj) {
    var file = obj.files[0];//获取文件流
    var val = obj.value;
    var suffix = val.substr(val.indexOf("."));
    var storeAs = 'blog/' + timestamp() + suffix;
    client.multipartUpload(storeAs, file).then(function (result) {
        var options = { expires: 10000000 }; //options可以传入链接的失效时间
        url = client.signatureUrl(result.name, options);
        $(".Infolists img").attr("src",url)
        console.log(url)
        // 获取url后直接走接口将url传给node 保存在数据库中        
    }).catch(function (err) {
        console.log(err);
    });
}
$(".buttons-sub").click(function(){
    console.log( $("#username").val())
    console.log( $("#sex").val())
    console.log( $("#email").val())
    console.log(url)

    $.ajax({
        type: "post",
        url: "/api/setUserInfo",
        data: {
            username:$("#username").val(),
            email: $("#email").val(),
            sex: $("#sex").val(),
            logo: url,
            // id:
        },
        dataType: 'json',
        success: function (result) {
            if (result.code == 10000) {
                window.location.href='/admin/mineLists'
            }
        },
        error: function (error) {
            console.log(error)
        }
    })
})