
function getURL() {
    const hostname = window.location.hostname;
    if (hostname == "localhost") {
        return '';
    }
    else {
        return '/Ticketing';
    }

};

var myurl = getURL();


function SendVendor(Id, ticketno) {
    $.ajax({
        url: myurl +'/TicketGenerator/SendToVendor',
        type: "post",
        data: { Id: Id, TicketNo: ticketno },
        success: (data) => {
            alert(data);
            window.location.href = myurl + '/Dashboard/dashboardapproved';
        },
        error: (data) => {
            alert(data)
        }

    })
}