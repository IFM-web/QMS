function getURL() {
    const hostname = window.location.hostname;
    if (hostname == "localhost") {
        return '';
    }
    else {
        return '/Ticketing';
    }

};

$(document).ready(function () {
    ShowItems();
})

var myurl = getURL();
function ShowItems() {

    var Status = sessionStorage.getItem("Status");

    var CompnayCode = sessionStorage.getItem("CompnayCode");
    var Region = sessionStorage.getItem("Zone");
    var Branch = sessionStorage.getItem("Branch");
    var Customer = sessionStorage.getItem("Customer");
    var TicketType = sessionStorage.getItem("TicketType");
    

    $.ajax({
        url: myurl + '/Dashboard/AllItemStatus',
        type: 'get',
        data: { status: Status, CompnayCode: CompnayCode, Region: Region, Branch: Branch, Customer: Customer, TicketType: TicketType },
            success: (data) => {
            console.log(data);
            var data = JSON.parse(data);
            CreateTableFromArray(data, 'printdiv')
        },
        error: (data) => {

        }
    })

}

function execl() {
    exportexcel("Ticket List")
}