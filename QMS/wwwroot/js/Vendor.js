$(document).ready(() => {
    show();
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
function Insert() {
    var valie = Validation();
    contactno = $("#contact").val()
  
    if (valie == '') {
        var contactPattern = /^\+?\d{10,15}$/; // ✅ use RegExp, not a string
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!contactPattern.test(contactno)) {
            Swal.fire({
                icon: "error",
                html: "Wrong Contact No !!",

            });
            return false; // ❌ block further action
        }
        if (!emailPattern.test($("#Email").val())) {
            Swal.fire({
                icon: "error",
                
                html: "Wrong Email Id !!",

            });
            return false;
        }

        $.ajax({
            url: myurl +'/Master/VendorInsert',
            type: "post",
            data: {
                name: $("#Name").val(),
                contact: $("#contact").val(),
                email: $("#Email").val(),
                address: $("#Address").val(),

            },
            success: (data) => {
                var data = JSON.parse(data);
           

                Swal.fire({
                    icon: data == "Inserted Successfully!" ?"success":"error",
                    html: data,
                    confirmButtonText: "OK"
                }).then((result) => {
                    if (data == 'Inserted Successfully!' && result.isConfirmed) {
                        window.location.reload();
                    }
                });
            

                
            },
            error: (err) => {
                alert(err);
            }


        })
    } else {
        Swal.fire({
            icon: "error",
            html: valie,

        });
    }
}

function show() {
    $("#quotationTableBody").empty();
    $.ajax({
        url: myurl+'/Master/ShowVedor',
        type: "post",
        data: {

        },
        success: (data) => {
            var data = JSON.parse(data);
            let row = "";
            let i = 1;
            for (let e of data) {
                row += `
                <tr>
                <td>${i}</td>
                <td>${e.Name}</td>
                <td>${e.ContactNo}</td>
                <td>${e.Email}</td>
                <td>${e.Address}</td>
                <td><button onclick="Delete('${e.Id}')" class="btn btn-danger">Delete</button></td>
                </tr>
                
                `
                i++;
            }

            $("#quotationTableBody").append(row);
        },
        error: (err) => {
            alert(err);
        }


    })
}

function Delete(Id) {
    $.ajax({
        url: myurl+'/Master/DeleteVendor',
        type: "post",
        data: {
            Id:Id
        },
        success: (data) => {
            var data = JSON.parse(data);
            alert(data);

            window.location.reload();
        },
        error: (err) => {
            alert(err);
        }


    })
}