function changeamt(amt) {

    var qty = parseFloat($("#qty").text());

    if (!isNaN(qty) && !isNaN(amt)) {
        var totalAmt = qty * amt;
        $("#totalamt").text(totalAmt.toFixed(2)); // formats to 2 decimal places
    } else {
        $("#totalamt").text("Invalid input");
    }
}

function Update() {

    let itemsArray = []
    $("#quotationTableBody TR").each(function (index, row) {
        var Items = {};
        if ($(row).find('#Id').text() != '') {
            Items.Id = $(row).find("#Id").text();
            Items.rate = $(row).find('#rate').val();
            Items.toatal = $(row).find('#totalamt').text();

            itemsArray.push(Items);
        }

    });





    fdata = JSON.stringify(itemsArray);
    if (itemsArray.length > 0) {

        $.ajax({

            url: '/TicketGenerator/UpdatebyVendor',
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

