function formatDate2(d) {
    var date1 = new Date(d);
    let hours = date1.getHours()>9?date1.getHours():'0'+date1.getHours()
    let minutes = date1.getMinutes()>9?date1.getMinutes():'0'+date1.getMinutes()
    let seconds = date1.getSeconds()>9?date1.getSeconds():'0'+date1.getSeconds()
    return date1.getFullYear() + '年' + (date1.getMonth()+1) + '月' + date1.getDate() + '日 ' + hours + ':' + minutes + ':' + seconds;
}
