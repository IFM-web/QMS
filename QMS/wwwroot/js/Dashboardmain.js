
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
    $(function () {
        $("#custmernameid,#Region, #Branch,#companynameid,#tickettypeid").change(() => {
            binddashboard();
        });
    });


    $(".dashboard a").click(function () {
        sessionStorage.clear();
       
        var Status = $(this).find("#Status").val();
        var CompnayCode = $("#companynameid").val();
        var Region = $("#Region").val();
        var Branch = $("#Branch").val();
        var Customer = $("#custmernameid").val();
        var tickettype = $("#tickettypeid").val();
      
        sessionStorage.setItem("Status", Status);
        sessionStorage.setItem("CompnayCode", CompnayCode);
        sessionStorage.setItem("Zone", Region);
        sessionStorage.setItem("Branch", Branch);
        sessionStorage.setItem("Customer", Customer);
        sessionStorage.setItem("TicketType", tickettype );



        
    });


})




function bindRegion(id) {
    BindCustomer(id);
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
            divid.append('<Option value="All">All</Option>');
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
            divid.append('<Option value="All">All</Option>');
            for (var i = 0; i < data.length; i++) {

                divid.append(`<option value="${data[i].LocationAutoID}">${data[i].LocationCode}</option>`);
            }
        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}


function BindCustomer(id) {

    $.ajax({
        url: myurl + '/TicketGenerator/BindCustomerwithcompany',
        type: 'post',
        data: {
            companynameid: id
        },
        success: function (data) {
            var divid = $("#custmernameid");

            var data = JSON.parse(data);
           
         
            if (data.length > 0) {

                divid.empty();
      
                divid.append('<Option value="All">All</Option>');
            for (var i = 0; i < data.length; i++) {

                divid.append(`<option value="${data[i].ClientCode}">${data[i].ClientName}</option>`);
            }
            }
        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}
function binddashboard() {
    var companyname = $("#companynameid").val();
    var zoneid = $("#Region").val();
    var branch = $("#Branch").val();
    var customer = $("#custmernameid").val();
    var TicketType = $("#tickettypeid").val();
 
    
    $.ajax({
        url: myurl+'/TicketGenerator/binddashboard',
        type: 'post',
        data: {
            companynameid: companyname,
            zone: zoneid,
            branch: branch,
            Customer: customer,
            TicketType: TicketType

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
            $('#Assgintovendor').html(data[0].Assgintovendor);
            $('#ExecutedbyVendor').html(data[0].ExecutedbyVendor);
            $('#ExecutedInternally').html(data[0].ExecutedInternally);
            $('#QuotationVendorApproved').html(data[0].QuotationVendorApproved);

        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}
