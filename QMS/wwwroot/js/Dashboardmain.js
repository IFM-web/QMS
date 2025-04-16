
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




function binddashboard() {
    var companyname= $("#companynameid").val();
    $.ajax({
        url: myurl+'/TicketGenerator/binddashboard',
        type: 'post',
        data: {
            companynameid: companyname

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
