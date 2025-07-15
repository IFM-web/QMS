$(document).ready(() => {
    SumTotal()
})
  function changeamt(input) {
    // Allow only numbers and one decimal point
    let val = $(input).val().replace(/[^0-9.]/g, '');            // Remove non-numeric except dot
    val = val.replace(/^([^.]*\.)|\./g,'$1');                   // Allow only one dot
    $(input).val(val);                                           // Update input box

    let $row = $(input).closest("tr");
    let qty = parseFloat($row.find(".qty").text());              // Use .val() if qty is input
    let rate = parseFloat(val);

      if (!isNaN(qty) && !isNaN(rate)) {
          let totalAmt = qty * rate;
          $row.find(".totalamt").text(totalAmt.toFixed(2));
      } else {
          $row.find(".totalamt").text('')
      }
      SumTotal()
}
function SumTotal() {
    let sum = 0.00;

    $("#quotationTableBody tr").each(function (index, row) {
        let amtText = $(row).find(".totalamt").text();
        let amt = parseFloat(amtText);
        if (!isNaN(amt)) {
            sum += amt;
        }
    });
    var totalamout = sum;
    var gstamount = sum * 18 / 100;
    var GrandTotal = totalamout + gstamount;
    $("#totalAmt").text(totalamout.toFixed(2))
    $("#GSTamt").text(gstamount.toFixed(2))
    $("#Grandtotal").text(GrandTotal.toFixed(2))
}


function validateTableInputs() {
    var isValid = true;

    $("table tr").each(function () {
        $(this).find("input").each(function () {
            var value = $(this).val().trim();
            if (!/^\d+(\.\d+)?$/.test(value)) {
                isValid = false;
                $(this).addClass("input-error"); // optional: add red border or highlight
            } else {
                $(this).removeClass("input-error");
            }
        });
    });

    return isValid;
}


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
function Update() {
   
    
     
   
    let itemsArray = []
    $("#quotationTableBody TR").each(function (index, row) {
        var Items = {};
        if ($(row).find('#Id').text() != '') {
            Items.Id = $(row).find("#Id").text();
            Items.rate = $(row).find('#rate').val() || 0;
            Items.toatal = $(row).find('.totalamt').text() ||  0;

            itemsArray.push(Items);
        }

    });





    fdata = JSON.stringify(itemsArray);
    if (itemsArray.length > 0) {

        $.ajax({

            url: myurl+'/TicketGenerator/UpdatebyVendor',
            type: 'post',
            data: { JsonData: fdata, ticketNO: $("#ticketno").val() },

            success: function (data) {
                var data = JSON.parse(data);
                console.log(data)
                if (data == 'Successfull') {

                    alert("Items Updated SuccessFully");
                    window.location.reload();
                }


            },
            error: function (err) {
                console.log("Error:", err);
                alert(err);
            }
        });
    } else {
        alert("Please Select Any Item");
    }
    


}



function UpdateReview() {
    if (validateTableInputs()) {



        let itemsArray = []
        $("#quotationTableBody TR").each(function (index, row) {
            var Items = {};
            if ($(row).find('#Id').text() != '') {
                Items.Id = $(row).find("#Id").text();
                Items.rate = $(row).find('#rate').val() || 0;
                Items.toatal = $(row).find('.totalamt').text().trim() || 0;

                itemsArray.push(Items);
            }

        });





        fdata = JSON.stringify(itemsArray);
        if (itemsArray.length > 0) {

            $.ajax({

                url: myurl + '/TicketGenerator/UpdatebyVendorReview',
                type: 'post',
                data: { JsonData: fdata, ticketNO: $("#ticketno").val() },

                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data)
                    if (data == 'Successfull') {

                        alert("Items Updated SuccessFully");
                        window.location.reload();
                    }


                },
                error: function (err) {
                    console.log("Error:", err);
                    alert(err);
                }
            });
        } else {
            alert("Please Select Any Item");
        }
    } else {
        alert("Please enter only numbers in all fields.");
    }


}