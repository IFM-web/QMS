
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
    document.getElementById('todate').value = new Date().toISOString().substring(0, 10);
    document.getElementById('fromdate').value = new Date().toISOString().substring(0, 10);
    $("#companynameid").trigger("change", function () {
        $("#custmernameid");

    });
    $("#tickettypeid").trigger("change", function () {
        $("#categoryid");

    });








})



function dashboardd() {

    $.ajax({
        url: myurl + "/TicketGenerator/ShowDashboard",
        type: "post",
        data: {
            companycode: $("#companynameid").val(),
            clientcode: $("#custmernameid").val(),
            asmitid: $("#sitenameid").val(),
            ttype: $("#tickettypeid").val(),
            tcate: $("#categoryid").val(),
            priorityid: $("#priorityid").val(),
            ticketstatus: $("#ticketstatus").val(),
            fromdate: $("#fromdate").val(),
            todate: $("#todate").val(),
            ticketno: $("#ticketno").val(),
            status: $("#ticketstatus").val(),



        },
        success: function (data) {
            data = JSON.parse(data);
            var row = "";


            $("#quotationTableBody").empty();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                    var ticketImagePath = data[i].TicketImage
                        ? `<img src="data: image/jpeg;base64,${data[i].TicketImage}" width="100" height="100" />`
                        : "";

                    var closurePhotoPath = data[i].ClosurePhoto
                        ? `<img src="data: image/jpeg;base64,${data[i].ClosurePhoto}"  width="100" height="100" />`
                        : "";

                    var ClosureSignPath = data[i].ClosureSign
                        ? `<img src="data: image/jpeg;base64,${data[i].ClosureSign}"  width="100" height="100" />`
                        : "";



                    row += "<tr id='row" + i + "'>" +
                        "<td>" + parseInt(i + 1) + "</td>" +
                        "<td class='ClientName'>" + (data[i].ClientName || "") + "</td>" +
                        "<td class='AsmtName'>" + (data[i].AsmtName || "") + "</td>" +
                        "<td class='TicketType'>" + (data[i].TicketType || "") + "</td>" +
                        "<td class='CategoryType'>" + (data[i].CategoryType || "") + "</td>" +
                        "<td class='MannualTicketNo'>" + (data[i].MannualTicketNo || "") + "</td>" +
                        "<td class='Description'>" + (data[i].Description || "") + "</td>" +
                        "<td class='Priority'>" + (data[i].Priority || "") + "</td>" +
                        "<td class='Status'>" + (data[i].Status || "") + "</td>" +
                        "<td class='CreationDate'>" + (data[i].CreationDate || "") + "</td>" +
                        "<td class='TicketImage'>" + ticketImagePath + "</td>" +
                        "<td class='AssignedTo'>" + (data[i].AssignedTo || "") + "</td>" +
                        "<td class='AssignmentDate'>" + (data[i].AssignmentDate || "") + "</td>" +
                        "<td class='ClosureDate'>" + (data[i].ClosureDate || "") + "</td>" +
                        "<td class='ClosureRemarks'>" + (data[i].ClosureRemarks || "") + "</td>" +
                        "<td class='ClosureSign'>" + ClosureSignPath + "</td>" +
                        "<td class='ClosurePhoto'>" + closurePhotoPath + "</td>" +
                        "</tr>";
                }


                $("#quotationTableBody").append(row);
            } else {
                Swal.fire({
                    title: 'Message',
                    html: 'Record Not Found !!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        },


        error: function (err) {
            alert(err.message);
        }
    });


}








function BindCustomer(id) {

    $.ajax({
        url: myurl + '/TicketGenerator/BindCustomer',
        type: 'post',
        data: {
            companynameid: id
        },
        success: function (data) {
            var divid = $("#custmernameid");
            var data = JSON.parse(data);
            divid.empty();
            divid.append('<Option value="All">All</Option>');
            for (var i = 0; i < data.length; i++) {

                divid.append(`<option value="${data[i].ClientCode}">${data[i].ClientName}</option>`);
            }
        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}





function BindSite(id) {
    var companynameid = $('#companynameid').val();

    $.ajax({
        url: myurl + '/TicketGenerator/BindSite',
        type: 'post',
        data: {
            companynameid: companynameid,
            custmernameid: id
        },
        success: function (data) {
            var divid = $("#sitenameid");
            var data = JSON.parse(data);
            divid.empty();
            divid.append('<Option value="All">All</Option>');
            for (var i = 0; i < data.length; i++) {

                divid.append(`<option value="${data[i].AsmtId}">${data[i].AsmtName}</option>`);
            }

        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}
function Bindcate(id) {


    $.ajax({
        url: myurl + '/TicketGenerator/BindCategory',
        type: 'post',
        data: {
            ttype: id

        },
        success: function (data) {
            var divid = $("#categoryid");
            var data = JSON.parse(data);
            divid.empty();
            divid.append('<Option value="All">All</Option>');
            for (var i = 0; i < data.length; i++) {

                divid.append(`<option value="${data[i].TicketCategory}">${data[i].TicketCategory}</option>`);
            }

        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}



function BindTicketAssigndata() {

    var fromdate = $('#fromdate').val();
    var todate = $('#todate').val();
    var tikitno = $('#tikitno').val();
    var tickettypeid = $('#tickettypeid').val();
    var categoryid = $('#categoryid').val();
    var priorityid = $('#priorityid').val();
    var companynameid = $('#companynameid').val();
    var custmernameid = $('#custmernameid').val();
    var sitenameid = $('#sitenameid').val();
    var tikitstatus = $('#tikitstatus').val();




    $.ajax({
        url: myurl + '/TicketGenerator/BindTicketAssigndata',
        type: 'post',
        data: {
            fromdate: fromdate,
            todate: todate,
            tikitno: tikitno,
            tickettypeid: tickettypeid,
            categoryid: categoryid,
            priorityid: priorityid,
            companynameid: companynameid,
            custmernameid: custmernameid,
            sitenameid: sitenameid,
            tikitstatus: tikitstatus
        },
        success: function (data) {
            //console.log(data.Data);

            var data = JSON.parse(data);

            var row = ""
            //            for (var i = 0; i < data.length; i++) {
            //                row += "<tr id='row" + i + "'><td>" + parseInt(i + 1) + "</td><td class='ClientCode'>" + data[i].ClientCode + "</td><td class='AsmtId'>" + data[i].AsmtId + "</td><td class='MannualTicketNo' >" + data[i].MannualTicketNo + "</td><td class='TicketType'>" + data[i].TicketType + "</td><td class='CategoryType'>" + data[i].CategoryType + "</td><td class=' Description'>" + data[i].Description + "</td><td class='Priority'>" + data[i].Priority + "</td><td class='CreationDate'>" + data[i].CreationDate + "</td><td class='CompanyCode'>" + data[i].CompanyCode + "</td><td>
            //                    < button class='btn btn-success' onclick = "assignRow('${i}')" >
            //                        Assign
            //    </button >
            //</td ></tr>";
            //            }
            $("#quotationTableBody").empty();
            if (data.length > 0) {



                for (var i = 0; i < data.length; i++) {
                    row += "<tr id='row" + i + "'>" +
                        "<td>" + parseInt(i + 1) + "</td>" +
                        "<td class='ClientCode'>" + data[i].ClientCode + "</td>" +
                        "<td class='AsmtId'>" + data[i].AsmtId + "</td>" +
                        "<td class='MannualTicketNo'>" + data[i].MannualTicketNo + "</td>" +
                        "<td class='TicketType'>" + data[i].TicketType + "</td>" +
                        "<td class='CategoryType'>" + data[i].CategoryType + "</td>" +
                        "<td class='Description'>" + data[i].Description + "</td>" +
                        "<td class='Priority'>" + data[i].Priority + "</td>" +
                        "<td class='CreationDate'>" + data[i].CreationDate + "</td>" +
                        "<td class='CompanyCode'>" + data[i].CompanyCode + "</td>" +
                        "<td>" +
                        "<button class='btn btn-success' data-toggle='modal' data-target='#exampleModalCenter' onclick=assignRow('" + data[i].MannualTicketNo + "')>" +
                        "Assign" +
                        "</button>" +
                        "</td>" +
                        "</tr>";
                }
            } else {
                Swal.fire({
                    title: 'Message',
                    html: 'Record Not Found !!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }

            //$(".companybody").html(row);
            $("#quotationTableBody").append(row);
        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}






function assignRow(ticketno) {

    $('#tikitdiv').show();
    $.ajax({
        url: myurl + '/TicketGenerator/assignRow',
        type: 'post',
        data: {
            ticketno: ticketno

        },
        success: function (data) {

            var data = JSON.parse(data);



            $('#tikitid').val(data[0].MannualTicketNo);
            $('#empcode').val(data[0].EmpID);
            $('#empname').val(data[0].EmpName);

        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}

function updatestatus() {



    $.ajax({
        url: myurl + '/TicketGenerator/updatestatus',
        data: {

            tikitid: $('#tikitid').val(),
            empcode: $('#empcode').val(),
            empname: $('#empname').val()




        },
        type: 'post',

        success: function (data) {

            Swal.fire({
                title: data.status,
                html: data.message,
                icon: data.status,
                confirmButtonText: 'OK'
            }).then(function () {
                location.reload();
            });
        },
        error: function (xhr, status, error) {
            // SweetAlert for error
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while saving the data. Please try again.',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        },
    });

}




function binddashboard() {
    var companyname = $("#companynameid").val();
    $.ajax({
        url: myurl + '/TicketGenerator/binddashboard',
        type: 'post',
        data: {
            companynameid: companynameid

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
