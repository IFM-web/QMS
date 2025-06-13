
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

            for (var i = 0; i < data.length; i++) {

                var url = 'data:image/jpeg;base64,' + data[i].ClosurePhoto;
                var url1 = 'data:image/jpeg;base64,' + data[i].TicketImage;
                var url2 = 'data:image/jpeg;base64,' + data[i].ClosureSign;


                //var url = data[i].ClosurePhoto
                //    ? 'data:image/jpeg;base64,' + data[i].ClosurePhoto
                //    : "";
                //var url1 = data[i].TicketImage
                //    ? 'data:image/jpeg;base64,' + data[i].TicketImage
                //    : "";
                //var url2 = data[i].ClosureSign
                //    ? 'data:image/jpeg;base64,' + data[i].ClosureSign
                //    : "";


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

                    "<td>" +
                   
                    "</td>" +
                    //"<td class='TicketImage'>" + ticketImagePath + "</td>" + 
                    "<td class='AssignedTo'>" + (data[i].AssignedTo || "") + "</td>" +
                    "<td class='AssignmentDate'>" + (data[i].AssignmentDate || "") + "</td>" +
                    "<td class='ClosureDate'>" + (data[i].ClosureDate || "") + "</td>" +
                    "<td class='ClosureRemarks'>" + (data[i].ClosureRemarks || "") + "</td>" +

                    "<td>" +
                   
                 
                    "</td>" +
                    //"<td class='ClosureSign'>" + ClosureSignPath + "</td>" +
                    //  "<td class='ClosurePhoto'>" + closurePhotoPath + "</td>" +
                    "<td>" +
                   
                    "</td>" +

                    "</tr>";
            }


            $("#quotationTableBody").append(row);
        },


        error: function (err) {
            alert(err.message);
        }
    });


}








function BindCustomer(id) {

    $.ajax({
        url: '/TicketGenerator/BindCustomer',
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
        url: '/TicketGenerator/BindSite',
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
        url: '/TicketGenerator/BindCategory',
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
        url: '/TicketGenerator/BindTicketAssigndata',
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
        url: '/TicketGenerator/assignRow',
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
        url: '/TicketGenerator/updatestatus',
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



function binddashboard(companynameid) {

    var companynameid = $('#companynameid').val();
    $.ajax({
        url: '/TicketGenerator/binddashboard',
        type: 'post',
        data: {
            companynameid: companynameid

        },
        success: function (data) {

            var data = JSON.parse(data);






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


function TicketClosureBind(tickitnoid) {
    $('#pdfd').hide();

    $.ajax({
        url: myurl+'/CMS/BindBranch',
        type: 'post',
        data: {
            tickitnoid: tickitnoid

        },
        success: function (data) {

            if (data != '[]') {
                const myDiv = document.getElementById('ticketdetails');
                myDiv.style.setProperty('display', 'block', 'important');

                var data = JSON.parse(data);



                $('#ticktno').html(tickitnoid);

                $('#ticktdate').html(data[0].TicketDate);
                $('#CustomerName').html(data[0].ClientName);
                $('#ticktdescription').html(data[0].TicketDescription);
                $('#siteName').html(data[0].AsmtName);

                TicketClosureBinddd(tickitnoid);

                addtoquotationrevieweddd(tickitnoid);
                $('#pdfd').show();
            }
            else {
                const myDiv = document.getElementById('ticketdetails');
                myDiv.style.setProperty('display', 'none', 'important');

                //Swal.fire({
                //    title: "Error !",
                //    text: "Review Quatation not found",
                //    icon: "Error"
                //});


            }
           
        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}

function TicketClosureBinddd(ticketno) {


    $.ajax({
        url: myurl+'/TicketGenerator/TicketClosureBind',
        type: 'post',
        data: {
            ticketno: ticketno

        },
        success: function (data) {

            var data = JSON.parse(data);


            $('#tr').show();
            $('#divclosutre').show();
            $('#tiiik1').show();
            /* $('#th1').html(1);*/
            $('#th2').html(data[0].Observation);
            $('#th3').html(data[0].Description);
            $('#th4').html(data[0].EmpName);
            var noImage =myurl + "/NoImage.jpg";

            var row = "";


            $("#ClosureTableBody").empty();
            for (var i = 0; i < data.length; i++) {

                var url = data[i].ClosurePhoto
                    ? 'data:image/jpeg;base64,' + data[i].ClosurePhoto
                    : noImage;

                var url1 = data[i].TicketGenerateImage1
                    ? 'data:image/jpeg;base64,' + data[i].TicketGenerateImage1
                    : noImage;

                var url5 = data[i].TicketGenerateImage2
                    ? 'data:image/jpeg;base64,' + data[i].TicketGenerateImage2
                    : noImage;

                var url3 = data[i].ObservationClientSign
                    ? 'data:image/jpeg;base64,' + data[i].ObservationClientSign
                    : noImage;

                var url4 = data[i].ObservationSign
                    ? 'data:image/jpeg;base64,' + data[i].ObservationSign
                    : noImage;

                var url2 = data[i].ClosureSign
                    ? 'data:image/jpeg;base64,' + data[i].ClosureSign
                    : noImage;

                var url6 = data[i].CreationSign
                    ? 'data:image/jpeg;base64,' + data[i].CreationSign
                    : noImage;



                row += "<tr id='row" + i + "'>" +
                    /*"<td>" + parseInt(i + 1) + "</td>" +*/


                    "<td class='ClosureDate'>" + (data[i].ClosureDate || "") + "</td>" +
                    //"<td>" +
                    //"<img data-toggle='modal' data-target='#myModal' onclick='image(\"" + url2 + "\")' " +
                    //"style='height: 100px; width: 100px;' src='" + url2 + "' class='ClosureSign' alt='Closure Sign'>" +
                    //"</td>" +
                    "<td class='ClosureRemarks'>" + (data[i].ClosureRemarks || "") + "</td>" +

                 


                    "</tr>";

                //document.getElementById('creationsign').src = url6;
                //document.getElementById('Clouserimage').src = url;
                //document.getElementById('tikit1image').src = url1;
                ///  document.getElementById('tikit2image').src = url5;
                document.getElementById('staffSignature').src = url4;
                document.getElementById('clientSignature').src = url3;
            }
            $("#ClosureTableBody").append(row);

        },
        error: function (error) {
            console.log('Error loading customer data:', error);
        }
    });
}

function addtoquotationrevieweddd(tickitnoid) {
    /*allitem.length = 0;*/
    var tickitnoid = $("#tickitnoid").val()

    $.ajax({
        url: myurl + '/TicketGenerator/GetDataToReviewddclose',

        type: 'post',
        data: {
            TicketNo: tickitnoid

        },
        success: function (data) {

            if (data != '[]') {
                const myDiv = document.getElementById('itemsquotayytion');
                myDiv.style.setProperty('display', 'block', 'important');

                var data = JSON.parse(data);

                
                allitem = [...data];
                console.log(allitem)
                showTable(allitem);

            }
            else {
                const myDiv = document.getElementById('itemsquotayytion');
                myDiv.style.setProperty('display', 'none', 'important');

                //Swal.fire({
                //    title: "Error !",
                //    text: "Review Quatation not found",
                //    icon: "Error"
                //});


            }

        }

    });

}

function showTable(allitem) {
    if (allitem.length > 0) {


        $("#quotationTableBoddy").empty();
        var row = '';
        for (var i = 0; i < allitem.length; i++) {
            row += `
                <tr>
                    <td>${i + 1}</td>
                    <td><span class='ItemCode'>${allitem[i].ItemCode}<span></td>
                    <td><span class='itemname'>${allitem[i].ItemName}</span></td>
                
                    <td><span>${allitem[i].ItemQty}<span></td>
                    <td> <span class='Itemunit'> ${allitem[i].ItemUnit}<span></td>
            
                   
                </tr>
            `;
        }
        $("#quotationTableBoddy").append(row);
    } else {
        $("#quotationTableBoddy").empty();

    }
}