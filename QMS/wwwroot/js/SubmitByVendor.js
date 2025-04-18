function changeamt(input) {
    var $row = $(input).closest("tr");
    var qty = parseFloat($row.find(".qty").text());
    var rate = parseFloat($(input).val());

    if (!isNaN(qty) && !isNaN(rate)) {
        var totalAmt = qty * rate;
        $row.find(".totalamt").text(totalAmt.toFixed(2));
    } else {
        $row.find(".totalamt").text("Invalid");
    }
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
    if (validateTableInputs()) {
    
     
   
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
    } else {
        alert("Please enter only numbers in all fields.");
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
                Items.toatal = $(row).find('.totalamt').text() || 0;

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