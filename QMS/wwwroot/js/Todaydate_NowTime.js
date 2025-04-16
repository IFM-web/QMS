function ReloadPage(controller, Action) {
    window.location = "/" + controller + "/" + Action;
}
function Todaydate() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    return today;
}
function CurrentTime() {
    var current = new Date();
    var time = (current.getHours()-12) + ":" + current.getMinutes() + ":" + current.getSeconds();
    return time;
}

function formatAMPM() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function datebefore1month() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth()+1)).slice(-2);
    var today = now.getFullYear() + "-" + (month-1) + "-" + (day);
    return today;
}



