// 获取列表
function getLists(number) {
    $.ajax({
        type: "post",
        url: '/api/getOwnLists',
        data: {
            pageSize: 1
        },
        dataType: 'json',
        success: function (result) {

            if (result.code == 2000) {
                let lists = result.data.datas
                console.log(999)
                $("#test").find("div").remove();
                if (lists.length > 0) {
                    console.log(10)
                    let str = ''
                    lists.forEach((item, index) => {
                        str += `  <li class="ownLists">
                        <div class="own-title">${item.title}</div>
                        <div class="own-articles">
                            <div class="own-imgs-left">
                                <img src=${item.url} alt="">
                            </div>
                            <div class="own-conts-right">
                               ${item.contentInfo}
                            </div>
                        </div>
                        <div class='readAll'>
                            阅读全文
                        </div>
                    </li>`
                    })
                    $(".ownCont ul").html(str)
                    $("#noLists").hide()
                    $("#test").show();
                    new Page({
                        el: '#test',
                        nums: Number(result.data.count),
                        counts: 5,
                        defaultPage: 1,
                        defaultPage: 1,
                        showHeadFoot: !false, // 显示首页尾页
                        jumpToOrder: true,  // 跳转到指定页
                        showNowAndAll: true, // 当前页/共几页
                        clickEvent: function (currectPage) {
                            getNewList(currectPage)
                        }
                    });
                } else {
                    $(".commentsLists").hide()
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
function getNewList(number) {
    $.ajax({
        type: "post",
        url: '/api/getOwnLists',
        data: {
            pageSize: number
        },
        dataType: 'json',
        success: function (result) {
            if (result.code == 2000) {
                let lists = result.data.datas
                console.log(lists.length)
                if (lists.length > 0) {
                    let str = ''
                    lists.forEach((item, index) => {
                        str += `  <li class="ownLists">
                        <div class="own-title">${item.title}</div>
                        <div class="own-articles">
                            <div class="own-imgs-left">
                                <img src=${item.url} alt="">
                            </div>
                            <div class="own-conts-right">
                               ${item.contentInfo}
                            </div>
                        </div>
                        <div class='readAll'>
                            阅读全文
                        </div>
                    </li>`
                    })
                    $(".ownCont ul").html(str)
                } else {
                    $(".commentsLists").hide()

                }
            }
        },
        error: function (error) {
            console.log(error)
        }
    })

}