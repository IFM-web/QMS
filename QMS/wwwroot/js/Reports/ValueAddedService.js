$(document).ready(() => {
    var type = $("#txttype").val()
    var type = $("#txttypesub").val()
    const formattedDate = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const toDate = new Date(Date.now()).toISOString().split('T')[0];
    document.getElementById('fromdate').value = formattedDate;
    document.getElementById('todate').value = toDate;
    showList()

});

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


function Back() {
    $(".form-container").addClass('d-none');
    $("#ListView").removeClass('d-none');
}
function showList() {
    $.ajax({
        url: myurl + '/Report/GetServiceslistheader',
        type: "get",
        data: {
            Customer: $("#Customer").val(),
            site: $("#Site").val(),
            fromdate: $("#fromdate").val(),
            todate: $("#todate").val(),
            
            type: $("#txttype").val(),
            subtype: $("#txttypesub").val(),
        },
        success: (data) => {
            var data = JSON.parse(data);
            var row = "";
            $("#listbody").empty();
            for (var e of data) {
                row += `<tr>
                <td>${e.ClientName}</td>
                <td>${e.AsmtName}</td>
                <td>${e.DateOfVisit}</td>
                <td><button class="btn btn-primary" onclick="show('${e.DateOfVisit}','${e.ClientCode}','${e.asmtID}')">View Audit</button></td>

                </tr>`;
            }
            $("#listbody").append(row);

        },
        error: (data) => {

        }
    });
}

function show(visitdate,customer,site) {
  
    $.ajax({
        url: myurl + '/Report/AuditValueAdd',
        type: "get",
        data: {
            Customer: customer,
            site: site,
            visitdate: visitdate,
            type: $("#txttype").val(),
            typesub: $("#txttypesub").val(),
        },
        success: (data) => {
            var data = JSON.parse(data);
            var dt1 = data.dt1;
            var dt2 = data.dt2;
            var dt3 = data.dt3;

            if (dt3.length > 0) {
                $(".form-container").removeClass('d-none');
                $("#ListView").addClass('d-none');

                $("#Technician").text(dt3[0].empName);
                $("#Designation").text(dt3[0].Designation);
                $("#DateofVisit").text(dt3[0].DateOfVisit);
                $("#site").text(dt3[0].AsmtName);
                $("#CustomerName").text(dt3[0].ClientName);


                function groupBySection(data) {
                    const grouped = {};
                    for (const item of data) {
                        const section = item.ChecklistHeader || "No Section";
                        if (!grouped[section]) grouped[section] = [];
                        grouped[section].push(item);
                    }
                    return grouped;
                }

                // Group data from both sides
                const leftGroups = groupBySection(dt1);
                //const rightGroups = groupBySection(dt2);

                // Get all unique sections from both
                const allSections = Array.from(new Set([
                    ...Object.keys(leftGroups),
                    //...Object.keys(rightGroups)
                ]));

                let row = "";

                for (const section of allSections) {
                    const leftItems = leftGroups[section] || [];
                    //const rightItems = rightGroups[section] || [];

                    const maxLength = Math.max(leftItems.length);

                    // Reset serial numbers per section
                    let i = 1, j = 1;

                    // Insert header once
    //                row += `
    //    <tr>
    //        <th colspan="8" style="background-color:#c3c1c1; text-align:center;">${section}</th>
    //    </tr>
    //`;

                    // Merge rows from left and right
                    for (let k = 0; k < leftItems.length; k++) {
                        const left = leftItems[k] || null;
                        //const right = rightItems[k] || null;

                        row += `
            <tr>
                <td>${left ? i : ""}</td>
                <td>${left?.ChecklistName || ""}</td>
                <td>${left?.Status || ""}</td>
                 <td>${left?.Remarks || ""}</td>
       <td >
    ${left.Photo != null
                            ? `<img src="data:image/jpeg;base64,${left.Photo}" class="AuditImage" alt="Photo"  >`
                                : ''}
  </td>

                
               
            </tr>
        `;

                        if (left) i++;

                    }
                }

                document.getElementById("tbody").innerHTML = row;



            }
            else {
                $(".form-container").addClass('d-none');
                document.getElementById("tbody").innerHTML = '';
                swal("Massage",'Not Found !','info')
            }
        },

        

        error: (err) => {
            alert(err);
        }


    })
}


function BindSite() {
    $.ajax({
        url: myurl + '/Report/Bindsite',
        type: 'get',
        data: {
            Id: $("#Customer").val()
        },
        success: (data) => {
            var data = JSON.parse(data);
            $("#Site").empty();
            $("#Site").append(`<option value='0'>All</option>`);
            for (var e of data) {
                $("#Site").append(`<option value='${e.Value}'>${e.Text}</option>`);
            }
        },
        error: (data) => {

        }    })
}



function ExportPdf() {
    var style = `
    <style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }

    .info-table th, td {
        border: 1px solid #000;
        padding: 8px;
       
    }

    .audit-table th, .audit-table td {
        border: 1px solid #000;
        padding: 8px;
        text-align: left;
    }

        body {
             -webkit-print-color-adjust: exact;
            font-family: 'Times New Roman', Times, serif, sans-serif;
            background-color: none;
           
           
                  

        }
         .info-table span {
        margin-left: 10px;
        font-weight: 600;
    }
     header,
                footer {
                    display: none;
                }
@page {
                size: A4;
                margin: 6.20mm;
                -webkit-print-color-adjust: exact;
              font-family: 'Times New Roman', Times, serif, sans-serif;
                  page-break-after: always;

                header,
                footer {
                    display: none;
                }



            }
      .AuditImage{
        width:100px !important;
        height:100px !important;}

        .printhide{
            display:none;
        }
         .logo {
            max-width: 250px;

        }
          .header1 {
            text-align: center;
            margin-bottom: 10px;
            margin: auto;

        }
    </style>
    `;
    var CustomerName = $("#CustomerName").text();
    var site = $("#site").text();
    var headerContent = `<title>${CustomerName}-${site}</title><body>
    <div id="pagecontainer">
        <div class="container" id="content">
            <div class="header1">
                 <img src="https://ifm360.in/grouplreportingportal/GroupL.jfif" alt="Group L Logo" class="logo">
                <p style="margin-top:-20px;">3rd Floor, w31, Okhla Industrial Area Phase 2 <br /> New Delhi 110020 </p>
         
            </div>

        </div>
          </div>
        </body>

</html>

`;

    var datadiv = document.getElementById("DivContainer");

    var popupwin = window.open();

    popupwin.document.write(style + headerContent + datadiv.innerHTML);
    popupwin.document.close();
    var logoImage = popupwin.document.getElementById("logoimag");
    popupwin.onload = function () {
        popupwin.focus();
        popupwin.print();
        popupwin.close();
    }
}