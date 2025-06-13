
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


$(document).ready(function () {
  
    binddashboard()
})

function bindRegion(id) {

    $.ajax({
        url: myurl + '/Home/bindRegion',
        type: 'get',
        data: {
            id: id
        },
        success: function (data) {
            var divid = $("#Region");
            var data = JSON.parse(data);
            divid.empty();
            divid.append('<Option value>Select</Option>');
            for (var i = 0; i < data.length; i++) {

                divid.append(`<option value="${data[i].HrLocationCode}">${data[i].HrLocationDesc}</option>`);
            }
        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}

function bindBranch() {

    $.ajax({
        url: myurl + '/Home/bindBranch',
        type: 'get',
        data: {
            id: $("#companynameid").val(),
            locid: $("#Region").val(),
        },
        success: function (data) {
            var divid = $("#Branch");
            var data = JSON.parse(data);
            divid.empty();
            divid.append('<Option value>Select</Option>');
            for (var i = 0; i < data.length; i++) {

                divid.append(`<option value="${data[i].LocationAutoID}">${data[i].LocationCode}</option>`);
            }
        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}



function binddashboard() {
    var companyname = $("#companynameid").val();
    var zone = $("#Region").val();
    var branch = $("#Branch").val();
 
    bindRegion(companyname)
    $.ajax({
        url: myurl+'/TicketGenerator/binddashboard',
        type: 'post',
        data: {
            companynameid: companyname,
            zone: zone,
            branch: branch,

        },
        success: function (data) {

            var data = JSON.parse(data);
            console.log(data)


            $('#totaltikit').html(data[0].TotalTicket);
            $('#newtikit').html(data[0].NewTicket);
            $('#inprogress').html(data[0].InProgressTicket);
            $('#moviefor').html(data[0].MoveForQuotationTicket);
            $('#quatationprepeared').html(data[0].QuotationPreparedTicket);
            $('#quatationapprove').html(data[0].QuotationApprovedTicket);
            $('#quatationreviewd').html(data[0].QuoationReviewedTicket);
            $('#close').html(data[0].ClosedTicket);

        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}
