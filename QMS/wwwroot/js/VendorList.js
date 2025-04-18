
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
    $("#fullscreen-loader").removeClass("d-none");
    $.ajax({
        url: myurl +'/TicketGenerator/SendToVendor',
        type: "post",
        data: { Id: Id, TicketNo: ticketno },
        success: (data) => {
            $("#fullscreen-loader").addClass("d-none");
            alert(data);
            window.location.href = myurl + '/Dashboard/dashboardapproved';
        },
        error: (data) => {
            $("#fullscreen-loader").addClass("d-none");
            alert(data)

        }

    })
}