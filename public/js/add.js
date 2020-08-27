$(function () {

    $('#summernote').summernote({
        placeholder: 'Hello Bootstrap 4',
        tabsize: 2,
        height: 100
    });
    $("#summernoteBtn").click(function () {
        var code = $("#summernote").summernote("code");
        $.ajax({
            type: "post",
            url: "/admin/content/add",
            data: {
                title: $("#title").val(),
                description: $("#description").val(),
                content: $("#content").val(),
                category: $("#category option:selected")[0].value
            },
            dataType: 'json',
            success: function (result) {
                if (result.code == 20000) {
                    console.log(result.error)
                    layer.msg(result.error, function () {});
                }
            },
            error: function (error) {
                console.log(error)
            }
        })

    })

})