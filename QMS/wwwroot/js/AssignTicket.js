
$(document).ready(function () {
    document.getElementById('todate').value = new Date().toISOString().substring(0, 10);
    document.getElementById('fromdate').value = new Date().toISOString().substring(0, 10);
    $("#companynameid").trigger("change", function () {
        $("#custmernameid");

    });

    $("#custmernameid").trigger("change", function () {
        $("#sitenameid");

    });

  



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
        url: myurl +'/TicketGenerator/BindSite',
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



function SaveData() {
    var val = Validation()
    if (val == '') {
        $('#loderid').show();
        $.ajax({
            url: myurl + '/GenerateTicketSmartFMWeb',
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
            console.log(data);
            var row = ""
          
            $("#quotationTableBody").empty();

            for (var i = 0; i < data.length; i++) {
                row += "<tr id='row" + i + "'>" +
                    "<td>" + parseInt(i + 1) + "</td>" +
                    "<td class='ClientCode'>" + data[i].ClientName + "</td>" +
                    "<td class='AsmtId'>" + data[i].AsmtName + "</td>" +
                    "<td class='MannualTicketNo'>" + data[i].MannualTicketNo + "</td>" +
                    "<td class='TicketType'>" + data[i].TicketType + "</td>" +
                    "<td class='CategoryType'>" + data[i].CategoryType + "</td>" +
                    "<td class='Description'>" + data[i].Description + "</td>" +
                    "<td class='Priority'>" + data[i].Priority + "</td>" +
                    "<td class='CreationDate'>" + data[i].CreationDate + "</td>" +
                    "<td class='CreatedBy'>" + (data[i].CreatedBy == null ? '' : data[i].CreatedBy )+ "</td>" +
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

    var val = $('#empname').val();
    var val2 = $('#empcode').val();

    if (val !== '' && val2 !== '') {
        $('#loderid').show();
        $.ajax({
            url: myurl + '/TicketGenerator/updatestatus',
            data: {

                tikitid: $('#tikitid').val(),
                empcode: $('#empcode').val(),
                empname: $('#empname').val()




            },
            type: 'post',

            success: function (data) {
                $('#loderid').hide();

                Swal.fire({
                    title: "success",
                    html: data,
                    icon: "success",
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
    else {
       
            Swal.fire({
                title: 'Error!',
                html: 'Employee Name Required !!',
                icon: 'error',

            });
    }

}


function getEmpName(id) {
    $.ajax({
        url: myurl + '/TicketGenerator/GetEmpName',
        data: {
            empno: id
        },
        type: 'post',
        success: function (data) {
            var data = JSON.parse(data);
            $('#empname').val(data[0].EmpName)
          

           
        }
        
    });
}
