﻿
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

function tbliddata() {
    
    var itemcodeid = $('#itemcodeid').find("option:selected").val();
    var tickitnoid = $('#tickitnoid').find("option:selected").val();

    if (itemcodeid != 0 && tickitnoid != 0) {
        $("#tbleiddata").show();
    } 
}


 



var allitem = [];
function BindBranch() {
    //var tickitnoid = $("#tickitnoid").text();

    var tickitnoid = $('#tickitnoid').val();
    $.ajax({
        url: myurl +'/CMS/BindBranch',
      
        type: 'post',
        data: {
            tickitnoid: tickitnoid

        },
        success: function (data) {

            allitem.length = 0; 
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
                tbliddata();
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


function AddQoutationDiv() {
    addqoutation.removeClass('d-none')
    

}


function BindCode() {
    $("#itemcode, #itemname, #itemunit, #itemrate,#itemGST").each(function () {
        $(this).prop("readonly", true);
    });
    var itemcodeid = $('#itemcodeid').val();
    $.ajax({
        url: myurl +'/CMS/BindCode',
    
        type: 'post',
        data: {
            itemcodeid: itemcodeid

        },
        success: function (data) {
            console.log(data);
            if (data != '[]') {
                data = JSON.parse(data);
                var rowlen = parseInt($('.companybody tr').length);
                var row = '';

                for (var i = 0; i < data.length; i++) {

                    $("#itemcode").val(data[i].ItemCode);
                    $("#itemname").val(data[i].itemDescription);
                    $("#itemunit").val(data[i].Unit);
                    $("#itemrate").val(data[i].Rate);
                    $("#itemGST").val('18%');
                    $("#qty").val(1);
                    
                    $("#grossamt").val(data[i].Rate +data[i].Rate * 18/100);





                }


            }




        }
        
    });

}














function deleteRow(id) {
    
    console.log(allitem)
    if (id !== -1) {
        allitem.splice(id, 1);
        showTable(allitem)
    }
}
function addtoquotation() {
    // itemsquotationTable.removeClass('d-none');
    var ItemQty = $("#qty").val()
    var ItemCode = $("#itemcode").val()
    if (ItemCode != '') {
        if (ItemQty > 0) {



            var items = {
                ItemCode: $("#itemcode").val(),
                ItemName: $("#itemname").val(),
                ItemUnit: $("#itemunit").val(),
                ItemRate: $("#itemrate").val(),
                ItemGst: $("#itemGST").val(),
                ItemQty: $("#qty").val(),
                GrossAmt: $("#grossamt").val(),
                TicketNO: $("#tickitnoid").val(),

            }

            console.log(allitem);

            $("#itemcode").val('');
            $("#itemname").val('');
            $("#itemunit").val('');
            $("#itemrate").val('');
            $("#itemGST").val('');
            $("#qty").val('');
            $("#grossamt").val('');
            allitem.push(items);
            showTable(allitem);

            Swal.fire({
                title: "success !",
                text: "Item Added SuccessFully!",
                icon: "success"
            });
       
        }
        else {
            Swal.fire({
                title: "Error !",
                text: "QTY must be greater then 0!",
                icon: "Error"
            });
            
        }
    }
    else {
        Swal.fire({
            title: "Error !",
            text: "please enter itemcode!",
            icon: "Error"
        });

      
    }
   

}


document.getElementById("qty").addEventListener("input", function (e) {
    this.value = this.value.replace(/[^0-9]/g, ""); 

    var qty = this.value;
    var Itemrate = $("#itemrate").val();
    var totalcost = qty * Itemrate

    var gstamt = totalcost * 18 / 100
    $("#grossamt").val(qty * Itemrate + gstamt);
});



function showTable(allitem) {
    if (allitem.length > 0) {
        $("#itemsquotation").removeClass('d-none');
        $("#btnsave").removeClass('d-none');

        $("#quotationTableBody").empty();
        var row = '';
        for (var i = 0; i < allitem.length; i++) {
            row += `
                <tr>
                    <td>${i + 1}</td>
                    <td class='ItemCode'>${allitem[i].ItemCode}</td>
                    <td><span class='itemDescription'>${allitem[i].ItemName}</span></td>
                    <td><span class='GST'>18%</span></td>
                    <td>${allitem[i].ItemQty}</td>
                    <td>${allitem[i].ItemUnit}</td>
                    <td class='rate'>${allitem[i].ItemRate}</td>
                    <td class='grossamt'>${allitem[i].GrossAmt}</td>
                    <td>
                        <button class='btn btn-danger' onclick="deleteRow('${i}')">
                            Remove
                        </button>
                    </td>
                </tr>
            `;
        }
        $("#quotationTableBody").append(row);
    } else {
        $("#quotationTableBody").empty();
        $("#btnsave").addClass('d-none');
        $("#itemsquotation").addClass('d-none');
    }
}

// Function to handle row deletion with SweetAlert confirmation
function deleteRow(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Remove the item from the array
            allitem.splice(index, 1);

            // Update the table with the new item list
            showTable(allitem);

            // Show SweetAlert confirmation for deletion
            Swal.fire(
                'Removed!',
                'The item has been removed from the quotation.',
                'success'
            );
        }
    });
}


function SaveData() {
    if ($("#ManageFeesId").val() != '0') {
        $('#loderid').show();
        var newdata = JSON.stringify(allitem);
        $.ajax({
            url: myurl + '/CMS/InsertQoutation',
            data: { data: newdata, ManageFeesId: $("#ManageFeesId").val() },
            type: 'post',

            success: function (data) {
                // SweetAlert for success
                $('#loderid').hide();
                Swal.fire({
                    title: 'Success!',
                    text: data.message, // Assuming `data.message` contains the success message
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(function () {
                    location.reload(); // Reload the page after the success alert is closed
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
            text: 'Select Management Fees !!',
            icon: 'error',
            confirmButtonText: 'Try Again'
        });
    }
}


