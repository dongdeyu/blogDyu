$(".alertDialog").click(function () {
    $.ajax({
        type: "post",
        url: '/api/addComments',
        data: {
            content: $("#commentsTextarea").val()
        },
        dataType: 'json',
        success: function (result) {
            if (result.code == 2000) {
                getLists()
            }
        },
        error: function (error) {
            console.log(error)
        }
    })
})
// 获取列表
function getLists() {
    $.ajax({
        type: "post",
        url: '/api/getCommentsLists',
        data: {
            pageSize:1
        },
        dataType: 'json',
        success: function (result) {
            if (result.code == 20000) {

            }
        },
        error: function (error) {
            console.log(error)
        }
    })
}