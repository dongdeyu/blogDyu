$(function () {
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
    $("#sumButton").click(function () {
        var content1 = $("#summernote2").summernote("code");
        var content2 = $("#summernote3").summernote("code");
        console.log($("#image").val())
        // $.ajax({
        //     type: "post",
        //     url: "/admin/mine/add",
        //     data: {
        //         title: $("#title").val(),
        //         description: $("#description").val(),
        //         content: $("#content").val(),
        //         category: $("#category option:selected")[0].value,
        //         codeCont:code
        //     },
        //     dataType: 'json',
        //     success: function (result) {
        //         if (result.code == 20000) {
        //             console.log(result.error)
        //             layer.msg(result.error, function () {});
        //         }
        //     },
        //     error: function (error) {
        //         console.log(error)
        //     }
        // })

    })

})