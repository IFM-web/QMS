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
var ticketdetails = $("#ticketdetails");
var addqoutation = $("#addqoutation");
var itemsquotationTable = $("#itemsquotation");


const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",];
const teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",];
const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",];
const thousands = ["", "Thousand", "Lakh", "Crore"];

function numberToWords(num) {
    if (num === "0") return "Zero";

    let numStr = num.toString();
    let word = "";
    let n = numStr.length;

    if (n > 9) return "overflow"; // number out of bounds

    // Pad the number with leading zeros for easier parsing
    numStr = numStr.padStart(9, "0");

    // Split the number into groups of two
    let crore = numStr.slice(0, 2);
    let lakh = numStr.slice(2, 4);
    let thousand = numStr.slice(4, 6);
    let hundred = numStr[6];
    let ten = numStr.slice(7);

    if (parseInt(crore) > 0) {
        word += `${convertTwoDigits(crore)} Crore `;
    }
    if (parseInt(lakh) > 0) {
        word += `${convertTwoDigits(lakh)} Lakh `;
    }
    if (parseInt(thousand) > 0) {
        word += `${convertTwoDigits(thousand)} Thousand `;
    }
    if (parseInt(hundred) > 0) {
        word += `${ones[hundred]} Hundred `;
    }
    if (parseInt(ten) > 0) {
        word += convertTwoDigits(ten);
    }

    return word.trim();
}

function convertTwoDigits(num) {
    num = parseInt(num, 10);
    if (num < 10) return ones[num];
    if (num > 10 && num < 20) return teens[num - 11];
    let unit = num % 10;
    let ten = Math.floor(num / 10);
    return `${tens[ten]} ${ones[unit]}`.trim();
}

function convertRupeesPaise(amount) {
    let [rupees, paise] = amount.toString().split(".");

    let rupeesInWords = numberToWords(parseInt(rupees));
    let paiseInWords = paise ? convertTwoDigits(paise.padEnd(2, "0")) : "";

    let result = "";
    if (rupeesInWords) {
        result += `${rupeesInWords} Rupees`;
    }
    if (paiseInWords) {
        result += ` and ${paiseInWords} Paise`;
    }

    return result.trim();
}


function printData() {
    var id = $("#tickitnoid").val();
    $.ajax({
        url: myurl + '/CMS/GetDatabyId',
        type: 'POST',
        data: { data: id },
        success: function (data) {
            var data1 = JSON.parse(data.data);
            var data2 = JSON.parse(data.data2);
            var date = new Date(data1[0].Entrydate); 


            var htmlforprint = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Quotation</title>
                 <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
        }
        h1, h2 {
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .header-table, .footer-table {
            width: 100%;
            margin-top: 20px;
        }
        .header-table td, .footer-table td {
            border: none;
            padding: 5px 0;
        }
        .footer-row td {
            font-weight: bold;
        }
        .amount-words {
            margin-top: 10px;
            font-style: italic;
        }
        .logo {
            text-align: center;
            margin-bottom: 10px;
        }
        .logo img {
            max-width: 150px;
        }


  @media print {
   .print-footer {
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #333;
    border-top: 1px solid #ccc;
    padding: 5px 0;
    background: #fff;
  }
 
  ul li{
        margin: 10px 0;
  }

    @page {
                size: A4;
                margin: 6.20mm 6.20mm 6.20mm 6.20mm;

                padding: 6.20mm 0;
                -webkit-print-color-adjust: exact;
              font-family: 'Times New Roman', Times, serif, sans-serif;
                  page-break-after: always;

                    border:2px solid black;
                header,
                footer {
                    display: none;
                }
#ButtonId{
    display:none;
}
                



            }

            header,
            footer,#ButtonId {
                display: none;
            }


}


.no-print {
    display: none;
  }


   ol li{
        margin: 10px 0;
        
  }

    </style>
       
            </head>
            <body>
            <button id="ButtonId" onclick="window.print()">Export To PDF</button>
            <div class="content">
                <div class="logo">
                    <img id="logoimag" src="https://ifm360.in/grouplreportingportal/grouplreportingportal/GroupL.jfif" alt="Group L Logo">
                </div>
                <div style="text-align: center; margin-bottom: 20px;">
GroupL Services Private Limited
<br/>
W-31 3rd floor Okhla industrial area phase-2 New Delhi 110020
</div><br/><br/>
                <h2>Quotation</h2>
                <table class="header-table">
                    <tr>
                        <td><strong>Customer Name:</strong> ${data2[0].ClientName}</td>
                        <td><strong>Ticket No.:</strong> ${id}</td>
                       
                    </tr>
                    <tr>
                        <td><strong>Branch:</strong> ${data2[0].AsmtName}</td>
                        <td><strong>Ticket Date:</strong> ${data2[0].TicketDate}</td>
                  
                    </tr>
                      <tr>
                        <td></td>
                        <td><strong>Quotation Date:</strong> ${date.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }) }</td>
                  
                    </tr>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>S.NO</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>GST</th>
                            <th>Qty</th>
                            <th>Unit</th>
                            <th>Rate</th>
                            <th>Gross Amount</th>
                        </tr>
                    </thead>
                    <tbody>`;

            var row = '';
            var total = 0;

            for (var i = 0; i < data1.length; i++) {
                

                row += `
                <tr>
                    <td style='text-align:center'>${i + 1}</td>
                    <td>${data1[i].ItemCode}</td>
                    <td>${data1[i].ItemName}</td>
                    <td>${data1[i].ItemGST}</td>
                    <td>${data1[i].ItemQty}</td>
                    <td>${data1[i].ItemUnit}</td>
                    <td>${data1[i].ItemRate}</td>
                    <td style='text-aligh:right;'>${data1[i].ItemQty * data1[i].ItemRate}</td>
                </tr> `;
                total += data1[i].ItemQty * data1[i].ItemRate;
            }


            var MagagePercent = data2[0].ManagePercent;
            let percent = parseFloat(MagagePercent.replace("%", ""));
            var ManageAmt = total * percent / 100;

            var gst = (total + ManageAmt) * 18 / 100;
            var gs = gst + total;

            var words = convertRupeesPaise((gs + ManageAmt).toFixed(2));

            var finalHtml = htmlforprint + row + `
              
                  
                        <tr>
                            <td colspan="6" class="text-right"><strong>Total</strong></td>
                            <td colspan="2" class="text-right">${total.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="6" class="text-right"><strong>Management Fee (${MagagePercent})</strong></td>
                            <td colspan="2" class="text-right">${ManageAmt}</td>
                        </tr>
                        <tr>
                            <td colspan="6" class="text-right"><strong>GST 18%</strong></td>
                            <td colspan="2" class="text-right">${gst.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="6" class="text-right"><strong>Grand Total</strong></td>
                            <td colspan="2" class="text-right">${(gs + ManageAmt).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                <p class="amount-words"><strong>Amount in Words:</strong> ${words}</p>
</div>

<div><br/>

<p><b>Terms and Conditions:</b></p>
<ol>
  <li>This quotation is valid for 30 days from the date of issue.</li>
  <li>Scope of work will be clearly defined, including both inclusions and exclusions.</li>
  <li>Quantity, unit price, and applicable taxes will be mentioned for each item/service.</li>
  <li>Payment terms will include advance percentage, balance payment timeline, and any applicable penalties for delay.</li>
  <li>Taxes and duties (e.g., GST) will be specified as either inclusive or exclusive.</li>
  <li>Labour charges will either be included or mentioned separately, if applicable.</li>
  <li>Responsibility for transportation costs will be defined—either borne by the vendor or the client.</li>
  <li>Delivery will be made within a specified number of working days from order confirmation.</li>
  <li>Items will be delivered to the location specified by the client.</li>
  <li>Installation will either be included or quoted separately with relevant terms.</li>
  <li>Warranty details for materials and/or installation will be provided, including duration and conditions.</li>
  <li>Client will ensure access to necessary utilities like water, electricity, and site access during execution.</li>
  <li>All required municipal or statutory permits and approvals shall be obtained by the client.</li>
  <li>Any variation in quantity or specifications after approval will be subject to revised quotation and client confirmation.</li>
  <li>Delays caused by force majeure events (e.g., natural disasters, strikes) will not be considered the vendor's responsibility.</li>
  <li>Work shall be considered complete only after formal sign-off by the client.</li>
</ol>

</div><br/><p>Prepared by:</p>
<p>Employee Id:</p> 
<p>Designation:</p>

                <p class="print-footer text-center">This is a system-generated quotation. Signature is not required.<br><b>Thank you for your Business</b></p>
              
            </body>
            
            </html>`


            var popupwin = window.open();

            //popupwin.document.open();
            popupwin.document.write(finalHtml);
            // popupwin.document.close();
            var logoImage = popupwin.document.getElementById("logoimag");
            //popupwin.onload = function () {
            //  popupwin.focus();
            // popupwin.print();
            // popupwin.close();
            //};



        },
        error: function (err) {
            alert('Error: ' + err.message);
        }
    });
}


function BindBranch() {

    var tickitnoid = $('#tickitnoid').val();
    $.ajax({
        url: myurl + '/CMS/BindBranch',

        type: 'post',
        data: {
            tickitnoid: tickitnoid

        },
        success: function (data) {


            data = JSON.parse(data);
            console.log(data)
            if (data.length > 0) {
                ticketdetails.removeClass('d-none');
                addqoutation.addClass('d-none');
                itemsquotationTable.addClass('d-none');

                $("#customernameid").val(data[0].ClientName);
                $("#firstid").show();
                $("#firstid1").show();

                $("#tickitdateid").val(data[0].TicketDate);
                $("#branchid").val(data[0].AsmtName);
                $("#descriptionid").val(data[0].TicketDescription);
                $("#observationid").val(data[0].TicketObservation);
                $("#quirmentid").val(data[0].TicketRequirements);

            }
            else {
                ticketdetails.addClass('d-none');
                $("#section2").hide();
                $("#itemcode").text('');
                $("#itemname").text('');
                $("#itemunit").text('');
                $("#itemrate").text('');
                $("#itemGST").text('');
                $("#qty").val('');
            }

        },
        error: function (data) {

            var data = {
                status: "Error",
                msg: "Error on server.",
                data: [],
            }

        },
    });

}


var htmldata = `
    < !DOCTYPE html>
        <html lang="en"/>
            <head>
                <meta charset="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                        <title>Quotation</title>
                        <style>
                            body {
                                font - family: Arial, sans-serif;
                            margin: 20px;
                            padding: 0;
        }
                            h1, h2 {
                                text - align: center;
        }
                            table {
                                width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
        }
                            th, td {
                                border: 1px solid #000;
                            padding: 8px;
                            text-align: left;
        }
                            th {
                                background - color: #f2f2f2;
                            text-align: center;
        }
                            .text-right {
                                text - align: right;
        }
                            .text-center {
                                text - align: center;
        }
                            .header-table, .footer-table {
                                width: 100%;
                            margin-top: 20px;
        }
                            .header-table td, .footer-table td {
                                border: none;
                            padding: 5px 0;
        }
                            .footer-row td {
                                font - weight: bold;
        }
                            .amount-words {
                                margin - top: 10px;
                            font-style: italic;
        }
                            .logo {
                                text - align: center;
                            margin-bottom: 10px;
        }
                            .logo img {
                                max - width: 150px;
        }


                            @media print {
   .print - footer1 {
                                position: fixed;
                            bottom: 0;
                            left: 0;
                            width: 100%;
                            text-align: center;
                            font-size: 12px;
                            color: #333;
                            border-top: 1px solid #ccc;
                            padding: 5px 0;
                            background: #fff;
  }
                            @page {
                                size: A4;
                            margin: 6.20mm 6.20mm 6.20mm 6.20mm;
                            -webkit-print-color-adjust: exact;
                            font-family: 'Times New Roman', Times, serif, sans-serif;
                            page-break-after: always;

                            border:2px solid black;
                            header,
                            footer {
                                display: none;
                }



            }

                            header,
                            footer {
                                display: none;
            }


}
                            .print-footer, header{
                                display: none;
 }

                            .no-print {
                                display: none;
  }



                        </style>
                    </head>
                    <body>
                        <div class="logo">
                            <img id="logoimag" src="https://ifm360.in/grouplreportingportal/grouplreportingportal/GroupL.jfif" alt="Group L Logo"/>
                        </div>
                        <h2>Quotation</h2>
                        </body>
                        </html>




                        `;







function sendpdf() {

    $('#loderid').show();

    var tickitnoid = $('#tickitnoid').val();


    $.ajax({
        url: myurl + '/TicketGenerator/QuotationtoClientPDF1',

        type: 'post',
        data: {
            tickitnoid: tickitnoid,
            htmldata: '',
            //  baseUrl: "https://ifm360.in/Ticketing/QuotationtoClientPDF"
        },
        success: function (data) {
            $('#loderid').hide();
            Swal.fire({
                title: "success",
                html: data.success,
                icon: "success",
                confirmButtonText: 'OK'
            }).then(function () {
                location.reload();
            });
        },
        error: function (data) {

            var data = {
                status: "Error",
                msg: "Error on server.",
                data: [],
            }

        },
    });

}


function ApproveandReview(id) {
    var tickitnoid = $('#tickitnoid').val();
    //var htmldata= retundhtml(tickitnoid)

    $.ajax({
        url: myurl + '/QMS/ApprovedAndReview1',

        type: 'post',
        data: {
            ticketno: tickitnoid,
            type: id,

        },
        success: function (data) {

            Swal.fire({
                title: "success",
                html: data.message,
                icon: "success",
                confirmButtonText: 'OK'
            }).then(function () {
                location.reload();
            });
        },
        error: function (data) {

            var data = {
                status: "Error",
                msg: "Error on server.",
                data: [],
            }

        },
    });
}

function Execute(id) {
    var tickitnoid = $('#tickitnoid').val();
    //var htmldata= retundhtml(tickitnoid)

    $.ajax({
        url: myurl + '/QMS/Quotationexecute',

        type: 'post',
        data: {
            ticketno: tickitnoid,
            type: id,

        },
        success: function (data) {

            Swal.fire({
                title: "success",
                html: data.message,
                icon: "success",
                confirmButtonText: 'OK'
            }).then(function () {
                location.reload();
            });
        },
        error: function (data) {

            var data = {
                status: "Error",
                msg: "Error on server.",
                data: [],
            }

        },
    });
}
