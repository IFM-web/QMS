$(document).ready(() => {
    Show();

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
    function bindRegion(id) {

        $.ajax({
            url: myurl + '/Home/bindRegion',
            type: 'get',
            data: {
                id: id
            },
            success: function (data) {
                var divid = $("#Region");
                var data = JSON.parse(data);
                divid.empty();
                divid.append('<Option value="0">Select</Option>');
                for (var i = 0; i < data.length; i++) {

                    divid.append(`<option value="${data[i].HrLocationCode}">${data[i].HrLocationDesc}</option>`);
                }
            },
            error: function (error) {
                console.log('Error loading customer data:', error);
            }
        });
    }

function Save() {
    var val = Validation();
    if (val == "") {

 
        $.ajax({
            url: myurl + '/Home/SaveUser',
            type: 'post',
            data: { LoginId: $("#LoginId").val(), UserName: $("#UserName").val(), Password: $("#Password").val(), Designation: $("#Designation").val(), Company: $("#customSelect").val(), CompanyName: $("#customSelectName").val(), Region: $("#customSelect2").val(), Status: $("#Status").is(":checked") ? 1 : 0 },
            success: (data) => {
                var data = JSON.parse(data);
                Swal.fire({
                    icon: data[0].Status,
                    html: data[0].Massage,
                    
                   
                   
                });
                if (data[0].Status == "success") {
                    clear();
                }
             
                Show();
            },
            error: (data) => {
                Swal.fire({
                 
                    html: data,
                    icon: 'error',
                  
                });
            }
       
        });
    } else {
        Swal.fire({
                       html: val,
            icon: 'error',
            
        });
    }
}
function Show() {
    $.ajax({
        url: myurl + '/Home/ShowUser',
        type: 'post',
        data: {  },
        success: (data) => {
            var data = JSON.parse(data);
            CreateTableFromArray(data, 'printdiv');


        },
        error: (data) => {
            console.log(data);
        }

    });
    }


function Deleted(Id) {
    $.ajax({
        url: myurl + '/Home/SaveDeleted',
        type: 'post',
        data: {Id:Id},
        success: (data) => {
            var data = JSON.parse(data);
            Swal.fire({
                icon: data[0].Status,
                html: data[0].Massage,



            });
            Show();
         
         
        },
        error: (data) => {
            console.log(data);
        }

    });
}


function clear() {
    $("#LoginId").val('');
    $("#UserName").val('');
    $("#Password").val('');
    $("#Designation").val('');
    $("#customSelectName").val('');
    $("#customSelect").val('')
    $("#customSelect2").val('')
}

const displayBox = document.getElementById('customSelect');
const displayBoxName = document.getElementById('customSelectName');
const menu = document.getElementById('checkboxContainer');
const wrapper = document.querySelector('.custom-multiselect');

// Open/close toggle
displayBoxName.addEventListener('click', function () {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// Close when clicking outside
document.addEventListener('click', function (event) {
    if (!wrapper.contains(event.target)) {
        menu.style.display = 'none';
    }
});


menu.addEventListener('change', function () {
    const selectedCheckboxes = Array.from(menu.querySelectorAll(".chkItem:checked"));

    // Get values
    const selectedValues = selectedCheckboxes.map(cb => cb.value);
    displayBox.value = selectedValues.join(",");

    // Get label text (next sibling label)
    const selectedTexts = selectedCheckboxes.map(cb => {
        const label = cb.nextElementSibling;
        return label ? label.innerText.trim() : "";
    });
    displayBoxName.value = selectedTexts.join(",");
});


//---------------------Region DDL---------------------------------------

const displayBox2 = document.getElementById('customSelect2');
const menu2 = document.getElementById('checkboxContainer2');
const wrapper2 = document.querySelector('.custom-multiselect2');

// Open/close toggle
displayBox2.addEventListener('click', function () {
    menu2.style.display = menu2.style.display === 'block' ? 'none' : 'block';
});

// Close when clicking outside
document.addEventListener('click', function (event) {
    if (!wrapper2.contains(event.target)) {
        menu2.style.display = 'none';
    }
});


menu2.addEventListener('change', function () {
    const selected = Array.from(menu2.querySelectorAll(".chkItem2:checked"))
        .map(cb => cb.value);
    displayBox2.value = selected.join(",");
});



