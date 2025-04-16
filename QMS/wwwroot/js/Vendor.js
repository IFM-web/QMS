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
    if (valie == '') {

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
                alert(data);

                window.location.reload();
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