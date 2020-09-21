$(".alertDialog").click(function () {
    if($("#commentsTextarea").val()==''){
        layer.msg('评论内容不可为空');
        return false;
    }
    $.ajax({
        type: "post",
        url: '/api/addComments',
        data: {
            content: $("#commentsTextarea").val()
        },
        dataType: 'json',
        success: function (result) {
            if (result.code == 2000) {
                getLists(1)
            }else if(result.code==4){
                layer.msg(result.message);
            }
        },
        error: function (error) {
            console.log(error)
        }
    })
})
// 获取列表
function getLists(number) {
    $.ajax({
        type: "post",
        url: '/api/getCommentsLists',
        data: {
            pageSize:1
        },
        dataType: 'json',
        success: function (result) {
            if (result.code == 2000) {
               let lists = result.data.datas
               $("#test").find("div").remove();
                if(lists.length>0){
                    let str = ''
                    lists.forEach((item,index)=>{
                        str += ` <li>
                            <div><img src="/public/images/head.jpg" width="40" alt=""></div>
                            <div>
                                <div class="tsbs">
                                    <div>${item.username}</div>
                                    <div>${formatDate2(item.reviewTime)}</div>
                                </div>
                                <div class="cont">${item.content}</div>
                            </div>
                         </li>`
                    })
                    $(".commentsListsUl").html(str)
                    $(".allCounts").html(result.data.allUsers)
                    $(".allReviews").html(result.data.count)
                    $("#noLists").hide()
                    $("#test").show();
                    new Page({
                        el: '#test',
                        nums:Number(result.data.count),
                        counts: 10,
                        defaultPage: 1,
                        defaultPage: 1,
                        showHeadFoot: !false, // 显示首页尾页
                        jumpToOrder: true,  // 跳转到指定页
                        showNowAndAll: true, // 当前页/共几页
                        clickEvent: function (currectPage) {
                            getNewList(currectPage)
                        }
                    });
                }else{
                    $(".commentsLists").hide()
                    $(".allCounts").html(0)
                    $(".allReviews").html(0)
                    $("#noLists").show()
                }
            }
        },
        error: function (error) {
            console.log(error)
        }
    })
}
getLists(1)
function getNewList(number){
    $.ajax({
        type: "post",
        url: '/api/getCommentsLists',
        data: {
            pageSize:number
        },
        dataType: 'json',
        success: function (result) {
            if (result.code == 2000) {
               let lists = result.data.datas
               console.log(lists.length)
                if(lists.length>0){
                    let str = ''
                    lists.forEach((item,index)=>{
                        str += ` <li>
                            <div><img src="/public/images/head.jpg" width="40" alt=""></div>
                            <div>
                                <div class="tsbs">
                                    <div>${item.username}</div>
                                    <div>${formatDate2(item.reviewTime)}</div>
                                </div>
                                <div class="cont">${item.content}</div>
                            </div>
                         </li>`
                    })
                    $(".commentsListsUl").html(str)
                    $(".allCounts").html(result.data.allUsers)
                    $(".allReviews").html(result.data.count)
                }else{
                    $(".commentsLists").hide()
                 
                }
            }
        },
        error: function (error) {
            console.log(error)
        }
    })

}