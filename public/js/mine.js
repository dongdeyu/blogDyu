
var url = ''
$('#summernote2').summernote({
    placeholder: 'Hello Bootstrap 4',
    tabsize: 2,
    height: 100
});
$('#summernote3').summernote({
    placeholder: 'Hello Bootstrap 4',
    tabsize: 2,
    height: 100
});

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
        console.log(url)
        // 获取url后直接走接口将url传给node 保存在数据库中        
    }).catch(function (err) {
        console.log(err);
    });
}

console.log($("#sumButton"))
$("#sumButton").click(function () {
    var content1 = $("#summernote2").summernote("code");
    var content2 = $("#summernote3").summernote("code");
    console.log(content1)
    console.log(content2)

    $.ajax({
        type: "post",
        url: "/admin/mine/add",
        data: {
            title: $("#title").val(),
            contentInfo: content1,
            contentDetail: content2,
            url: url,
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
