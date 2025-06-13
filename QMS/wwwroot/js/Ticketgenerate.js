
$(document).ready(function () {
    document.getElementById('todate').value = new Date().toISOString().substring(0, 10);
    document.getElementById('fromdate').value = new Date().toISOString().substring(0, 10);
})


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

function BindCustomer(id) {

    $.ajax({
        url: myurl+'/TicketGenerator/BindCustomer',
        type: 'post',
        data: {
            companynameid: id
        },
        success: function (data) {
            var divid = $("#custmernameid");
            var data = JSON.parse(data);
            divid.empty();
            divid.append('<Option value>Select</Option>');
            for (var i = 0; i < data.length; i++) {

                divid.append(`<option value="${data[i].ClientCode}">${data[i].ClientName}</option>`);
            }
        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}


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




//function BindTicket() {
//    var tickettypeid = $('#tickettypeid').val();
//    $.ajax({
//        url: '/CMS/BindTicket',  // Ensure this is the correct route
//        type: 'post',
//        data: {
//            tickettypeid: tickettypeid
//        },
//        success: function (data) {
//            // If data is returned as a string, parse it into JSON
//            data = JSON.parse(data);

//            console.log(data);  // Log data to check its structure
//            var categoryid = $('#categoryid');

//            categoryid.empty();  // Clear existing options
//            categoryid.append('<option value="">Select</option>');  // Default option

//            // Loop through data and add options to the dropdown
//            $.each(data, function (index, customer) {
//                // Assuming that the returned data has 'ClientCode' and 'ClientName' properties
//                categoryid.append('<option value="' + customer.TicketCategory + '">' '</option>');
//            });
//        },
//        error: function (error) {
//            console.log('Error loading customer data:', error);
//        }
//    });
//}


function BindSite(id) {
    var companynameid = $('#companynameid').val();

    $.ajax({
        url: myurl+'/TicketGenerator/BindSite',
        type: 'post',
        data: {
            companynameid: companynameid,
            custmernameid: id
        },
        success: function (data) {
            var divid = $("#sitenameid");
            var data = JSON.parse(data);
            divid.empty();
            divid.append('<Option value>Select</Option>');
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
        url: myurl+'/TicketGenerator/BindCategory',
        type: 'post',
        data: {
            ttype: id

        },
        success: function (data) {
            var divid = $("#categoryid");
            var data = JSON.parse(data);
            divid.empty();
            divid.append('<Option value>Select</Option>');
            for (var i = 0; i < data.length; i++) {

                divid.append(`<option value="${data[i].TicketCategory}">${data[i].TicketCategory}</option>`);
            }

        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}



function SaveData() {
    var val = Validation()
    if (val == '') {
        $('#loderid').show();
        $.ajax({
            url: myurl+'/GenerateTicketSmartFMWeb',
            data: {

                companycode: $("#companynameid").val(),
                clientcode: $("#custmernameid").val(),

                clientname: $('#custmernameid').find("option:selected").text(),
                asmitid: $("#sitenameid").val(),
                ttype: $("#tickettypeid").val(),
                tcate: $("#categoryid").val(),
                desc: $("#ticketdiscriptionid").val(),
                priorityid: $("#priorityid").val(),
                CRName: $("#clientnameid").val(),
                CRMobile: $("#clientmobileid").val(),
                Branch: $("#Branch").val(),
                CREmail: $("#clientemailid").val()

            },
            type: 'post',

            success: function (data) {
                $('#loderid').hide();
                Swal.fire({
                    title: data.status,
                    html: data.message,
                    icon: 'success',
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
    } else {
        Swal.fire({
            title: 'Error!',
            html: val,
            icon: 'error',

        });
    }
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
        url: myurl+'/TicketGenerator/BindTicketAssigndata',
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
        url: myurl+'/TicketGenerator/assignRow',
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
        url: myurl+'/TicketGenerator/updatestatus',
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
