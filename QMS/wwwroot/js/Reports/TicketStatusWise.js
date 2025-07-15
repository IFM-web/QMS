function Ticket(Id) {
    var id = Id;
    $.ajax({
        url: 'Ticketing/CMS/GetDatabyId',
        type: 'POST',
        data: { data: id },
        success: function (data) {
            var data1 = JSON.parse(data.data);
            var data2 = JSON.parse(data.data2);
            
            $("#printdiv").empty();
            if (data1.length > 0) {
                var date = new Date(data1[0].Entrydate);
           
            var htmlforprint = `
       
            <div class="content">
                
                <h2 class='text-center'>Quotation</h2>
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
            })}</td>
                  
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

   /*         var words = convertRupeesPaise((gs + ManageAmt).toFixed(2));*/

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

</div>

<div><br/>


</div><br/><p>Prepared by: ${data2[0].Preparedby}</p>
<p>Employee Id: ${data2[0].LoginId}</p> 
<p>Designation: ${data2[0].Designation}</p>

               
              
            </body>
            
            </html>`

            }

       
            $("#printdiv").append(finalHtml);

        },
        error: function (err) {
            alert('Error: ' + err.message);
        }
    });
}