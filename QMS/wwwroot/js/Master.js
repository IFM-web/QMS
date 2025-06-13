

function Validation() {
    var msg = "";
    var charregex = /^[a-zA-Z\s]+$/;
    var intregex = /^[0-9]+$/;
    var charintregex = /^[a-zA-Z0-9\s]+$/;


    $(".mandatory").each(function () {
        if ($(this).val() == "" || $(this).val() == "0") {
            var name = $(this).attr('name')
          
            msg += "" + name + "  Required !! <br/>";
        }
    });

    $(".checktaxes").each(function () {
        if ($(this).val() == "") {
            var name = $(this).attr('name')
            console.log($(this).val());
            msg += "" + name + "  Required !!\n";
        }
    });
    $(".chkint").each(function () {
        if (!intregex.test($(this).val())) {
            var name = $(this).attr('name')
            msg += "Enter Valid " + name + "!!\n";
        }
    });
    $(".chkcharint").each(function () {
        if (!charintregex.test($(this).val())) {
            var name = $(this).attr('name')
            msg += "Enter Valid " + name + "!!\n";
        }
    });
    $(".chkchar").each(function () {
        if (!charregex.test($(this).val())) {
            var name = $(this).attr('name')
            msg += "Enter Valid " + name + "!!\n";
        }
    });
 
    return msg;
}



function CommonAjax(var_url, var_data, var_type, var_ct, var_dt, encrp, divid) {

    if (var_type == "")
        var_type = "POST";

    if (var_ct == "")
        var_ct = "application/json;charset=utf-8";

    if (var_dt == "")
        var_dt = "json";

    $.ajax({
        url: var_url,
        data: { jsonData: var_data, UrlEncript: encrp },
        type: var_type,
        //contentType: var_ct,
        dataType: var_dt,
        success: function (data) {

            console.log(data);
            if (data.Message != "") {
                swal("Message", data.Message, data.Status == "Success" ? "success" : "error");
            }

            if (data.Message == "Success") {
                clear();
            }


            $(divid).empty();
            if (data.Data != undefined) {
                CreateTableFromArray(data.Data, divid);
                dtable();
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

function BindDropDown(var_url, var_data, var_type, var_ct, var_dt, divid) {

    if (var_type == "")
        var_type = "POST";

    if (var_ct == "")
        var_ct = "application/json;charset=utf-8";

    if (var_dt == "")
        var_dt = "json";

    $.ajax({
        url: var_url,        
        data: var_data,
        type: var_type,      
        dataType: var_dt,
        success: function (data) {
            var data = JSON.parse(data);
            divid.empty();
            divid.append('<Option value>Select</Option>');
            for (var i = 0; i < data.length; i++) {

                divid.append(`<option value="${data[i].id}">${data[i].name}</option>`);
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
function CommonAjaxx(var_url, var_data, var_type, var_ct, var_dt, encrp, divid) {

    if (var_type == "")
        var_type = "POST";

    if (var_ct == "")
        var_ct = "application/json;charset=utf-8";

    if (var_dt == "")
        var_dt = "json";

    $.ajax({
        url: var_url,
        data: { jsonData: var_data, UrlEncript: encrp },
        type: var_type,
        //contentType: var_ct,
        dataType: var_dt,
        success: function (data) {

            console.log(data);
            //if (data.Message != "") {
            //    swal("Message", data.Message, data.Status == "Success" ? "success" : "error");
            //}
            //if (data.Message == "Success") {
            //    clear();
            //}
            //$(divid).empty();
            if (data.Data != undefined) {
                CreateTableFromArray(data.Data, divid);
                dtable();
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


function BindtrnTable(var_url, var_data, var_type, var_ct, var_dt, encrp, divid) {

    if (var_type == "")
        var_type = "POST";

    if (var_ct == "")
        var_ct = "application/json;charset=utf-8";

    if (var_dt == "")
        var_dt = "json";

    $.ajax({
        url: var_url,
        data: { jsonData: var_data, UrlEncript: encrp },
        type: var_type,
        //contentType: var_ct,
        dataType: var_dt,
        success: function (data) {
            console.log(data.Data);
            if (divid == "1") {
                if (data.Status == "error") {
                    alert(data.Message);

                }


                else {

                    var array = data.Data;
                    console.log(array);
                    var row = ""
                    for (var i = 0; i < array.length; i++) {
                        row += "<tr id='row" + i + "'><td><span class='barcode' id='txtbarcode'>" + array[i].barcode + "</td><td><span class='productname' id='txtproductname'>" + array[i].productname + "</span></td><td style='display:none'><span class='itemid' id='txtitem'>" + array[i].ItemID + "</span></td><td><span class='item' id='txtitemcode" + i + "'> " + array[i].ItemCode + "</span></td></tr>";


                    }
                }

                $(".tbl").append(row);
            }
            else if (divid == 2) {
                if (data.Data.length > 0) {
                    $("#txtquantityof").val(data.Data[0]["Quantity"]);
                }
                else {
                    $("#txtquantityof").val('');
                }

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


function CommonAjaxgrid(var_url, var_data, var_type, var_ct, var_dt, encrp, divid) {

    if (var_type == "")
        var_type = "POST";

    if (var_ct == "")
        var_ct = "application/json;charset=utf-8";

    if (var_dt == "")
        var_dt = "json";

    $.ajax({
        url: var_url,
        data: { jsonData: var_data, UrlEncript: encrp },
        type: var_type,
        //contentType: var_ct,
        dataType: var_dt,
        success: function (data) {

            console.log(data);

            //if (data.Message != "") {
            //    swal("Message", data.Message, data.Message == data.Message ? "success" : "error");
        //}
            //if (a == 5) {
            //    console.log(data)
            //}
            //else {
            //    $(divid).innerHTML = ''
            //}

            //if (data.Message == "Success") {
            //    clear();
            //}



            $(divid).empty();
            if (data.Data != undefined && data.Message == '') {
                $("#txtrno").val(GenereteReceiptNo());
                CreateTableFromArray(data.Data, divid);
                dtable();

                var element1 = document.getElementById("btnSubmit");


                if (element1 !== null) {
                    element1.disabled = true;
                }

                calculae();
                ShowDetails();



            }

            else if (data.Message == '') {
                $("#Printdiv").empty();
                $("#PrintDetails").empty();


                var element1 = document.getElementById("amtresullist");
                element1.style.visibility = "hidden";
                $("#txtenteramt").val("");


                swal("Message", "Record not Found", "Record not Found" == "Record not Found" ? "error" : "error");

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
function CommonAjaxReport(var_url, var_data, var_type, var_ct, var_dt, encrp, divid) {

    if (var_type == "")
        var_type = "POST";

    if (var_ct == "")
        var_ct = "application/json;charset=utf-8";

    if (var_dt == "")
        var_dt = "json";

    $.ajax({
        url: var_url,
        data: { jsonData: var_data, UrlEncript: encrp },
        type: var_type,
        //contentType: var_ct,
        dataType: var_dt,
        success: function (data) {

            console.log(data);

            //if (data.Message != "") {
            // swal("Message", data.Message, data.Message == data.Message ? "success" : "error");
            //}
            
            //if (a == 5) {
            //    console.log(data)
            //}
            //else {
            //    $(divid).innerHTML = ''
            //}

            //if (data.Message == "Success") {
            //    clear();
            //}



            $(divid).empty();
            if (data.Data != undefined && data.Data.length >1) {
                // $("#txtrno").val(GenereteReceiptNo());
                CreateTableFromArray(data.Data, divid);
                dtable();
                       

            }

            else { 
            $("#Printdiv").empty();   
               swal("Message", "Record not Found", "Record not Found" == "Record not Found" ? "error" : "error");

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




function Bindtrntable(var_url, var_data, var_type, var_ct, var_dt, encrp, divid) {

    if (var_type == "")
        var_type = "POST";

    if (var_ct == "")
        var_ct = "application/json;charset=utf-8";

    if (var_dt == "")
        var_dt = "json";

    $.ajax({
        url: var_url,
        data: { jsonData: var_data, UrlEncript: encrp },
        type: var_type,
        //contentType: var_ct,
        dataType: var_dt,
        success: function (data) {
            //console.log(data.Data);
            if (divid == "1") {
                if (data.Status == "error") {
                    alert(data.Message);

                }
                else {

                    $("#ddlsupplier").val(data.Data[0].supplierid);
                    var array = data.Data;
                    console.log(array);
                    var row = ""
                    for (var i = 0; i < array.length; i++) {
                        row += "<tr id='row" + i + "'><td>" + parseInt(i + 1) + "</td><td class='itemn'>" + array[i].ItemName + "</td><td style='display:none;'><span class='itemid'>" + array[i].ItemId + "</span></td><td class='qnty' id='qnty" + i + "',1>" + array[i].Quantity + "</td><td><input type='text' name='Visual Testing' class='visual chkint' id='visual" + i + "' onchange='checkquantity(" + i + ",1,1);'  /></td><td><input type='text' name='Functional Testing' class='functional chkint' id='Functional" + i + "'   onchange='checkquantity(" + i + ",1,2)'/></td><td><input type='text' name='Fittment Testing' class='fittmnt chkint' id='Fittment" + i + "'  onchange='checkquantity(" + i + ",1,3)' /></td><td class='tqunty'><input type='text' class='tquan' value=" + array[i].TestedQuantity + " readonly /></td><td class='rquantity'><input type='text' class='rquantity' value='0' /></td><td class='rcriteria'><select class='rejcr'><option value='0'>select</option><option value='1'>Critcal</option><option value='2'>Major</option><option value='3'>Minor</option></select></td><td><select class='ress'><option value='0'>select</option><option value='1'>Pass</option><option value='2'>Fail</option></select></td><td><input type='text' class='reason' id='res" + i + "' placeholder='Remarks'/></td></tr>";
                    }

                    $(".companybody").html(row);
                }


            }

            else if (divid == "2") {
                if (data.Status == "error") {
                    alert(data.Message);
                    $(".companybody").empty();
                    $("#txtitemQ").val('');
                }
                else {
                    var array = data.Data;
                    console.log(array);
                    $("#txtHiddenId").val(array[0].tranid);
                    $("#txtitemQ").val(array[0].Hid_ItemQuantity);
                    $("#txttotreq").val(array[0].TotalItemReq);

                    var row = ""
                    for (var i = 0; i < array.length; i++) {
                        row += "<tr id='row" + i + "'><td>" + parseInt(i + 1) + "</td><td class='dtranid' style='display:none;'>" + array[i].TranDetailId + "</td><td class='itemid'>" + array[i].Itemid + "</td><td><span class='itemname'>" + array[i].ItemName + "</span></td><td id='bquan" + i + "'class='qnty'>" + parseFloat(array[i].ItemQuantity) + " </td><td class='tqunty'><input type='text' class='tquan' readonly value=" + parseFloat(array[i].ItemQuantity) * parseFloat(array[0].Hid_ItemQuantity) + " id='tquan" + i + "'/></td><td class='trqunty'><input type='text' class='treqquan' id='reqqu" + i + "' value=" + array[i].TotalReqQty + " onchange='chkIssuedQuan(this," + i + ")' /></td><td class='treqqunty'><input type='text' class='treqqunty' readonly id='treqqunty" + i + "' value=" + array[i].TotalRequisitionQty + " /></td></tr>";
                    }

                    $(".companybody").html(row);
                }
            }

            else if (divid == 3) {
                if (data.Status == "error") {
                    alert(data.Message);
                }
                else {
                    var array = data.Data;
                    $("#ddlsupplier").val(array[0].supplierid);
                    $("#txtpodate").val(array[0].InvoiceDate);
                    $("#txtamount").val(array[0].NetAmount);
                    $("#txtnoofitem").val(array[0].TotalItem);
                }
            }

            else if (divid == 4) {
                var array = data.Data;
                console.log(array);

                $("#txtchallannum").val(array[0].Challan_Number);
                $("#txtchdate").val(array[0].ChallanDate);
                $("#txtinvnum").val(array[0].InvoiceNo);
                $("#txtinvhdate").val(array[0].InvoiceDate);
                $("#txtponumber").val(array[0].PO_Number);
                $("#txtHiddenId").val(array[0].tranId);
                $("#ddlsupplier").val(array[0].SupplierId);

                for (var i = 0; i < array.length; i++) {
                    row += "<tr id='row" + i + "'><td>" + parseInt(i + 1) + "</td><td style='display:none;' class='itemid'>" + array[i].Itemid + "</td><td><span class='itemname'>" + array[i].ItemName + "</span></td><td style='display:none;' class='groupid'>" + array[i].GroupId + "</td><td class='group' id='group" + i + "'>" + array[i].GroupName + "</td><td class='qnty'>" + parseFloat(array[i].POQnty) + "</td><td><input type='text' class='mfcode' value='" + array[i].mfpartcode + "'/></td><td><input type='text' class='hsncode' value='" + array[i].HsnCode + "'/></td><td><input type='text' id='invo" + i + "' oninput='chkQuan(this," + i + ")' class='invo' value='" + array[i].InvoiceQty + "' /></td><td><input type='text' oninput='chkQuan(this," + i + ")' id='req" + i + "' class='recqty' value='" + array[i].RecQty + "' /></td><td>" + array[i].Actualrecqty + "</td><td><input type='text'  class='rate' id='rate" + i + "' value='" + array[i].Rate + "'/></td><td><input type='text' class='Amount' value='" + array[i].Amount + "'/></td><td><input type='text' id='short" + i + "' class='short' value='" + array[i].ShortExcess + "' readonly /></td></tr>";
                }

                $(".salebody").html(row);

            }

            else if (divid == 5) {
                var array = data.Data;
                console.log(array);
                $("#tbdy").empty();
                var row = "";
                row += '<table id="modeltable"><thead><tr><th>select</th><th>Item</th><th>Quantity</th><th>Part Code</th><th>Size</th><th>Category</th></tr></thead><body>';
                for (var i = 0; i < array.length; i++) {

                    /*var row = "<tr><td style='display:none;'><span id='bitemid" + i + "' class='bitemid'>" + array[i].Hid_bomitemid + "</span></td><td><select id='ddlitem" + i + "' class='form-control itm'><option value='0'>Select</option></select></td><td><input type='text' class='qnty' id='txtbmbqty" + i + "'></td><td><input type='button' value='Add' id='btn" + i + "' onclick='addrow(" + i + ")' /></td></tr>";*/

                    row += "<tr><td style='display:none;'><span id='bitemid" + i + "' class='bitemid'>" + array[i].Hid_bomitemid + "</span></td><td style='display:none;'><span id='itemid" + i + "' class='itemid'>" + array[i].Hid_itemid + "</span></td><td>" + array[i].Select + "</td><td class='itm'>" + array[i].ItemName + "</td><td>" + array[i].Quantity + "</td><td>" + array[i].AliasName + "</td><td>" + array[i].SizeName + "</td><td>" + array[i].categoryName + "</td></tr>";


                    //BindYear(i);
                    //$("#bitemid" + i + "").val(array[i].Hid_bomitemid);
                    //$("#txtbmbqty" + i + "").val(array[i].ItemQuantity);
                    //$("#ddlitem" + i + "").val(array[i].Hid_itemid);
                }
                row += "</tbody></table>";
                $("#PrintdivModal").html(row);
                $("#btnbomopen").hide();
                $("#btnbomedit").show();

            }

            else if (divid == 6) {
                var array = data.Data;
                console.log(array);
                var row = "";
                row += '<table id="modeltable"><thead><tr><th>Select</th><th>Item</th><th>Quantity</th><th>Part Code</th><th>Size</th><th>Category</th></tr></thead><body>';
                for (var i = 0; i < array.length; i++) {

                    row += "<tr><td style='display:none;'><span id='bitemid" + i + "' class='bitemid'>0</span></td><td style='display:none;'><span id='itemid" + i + "' class='itemid'>" + array[i].Hid_itemid + "</span></td><td>" + array[i].Select + "</td><td class='itm'>" + array[i].ItemName + "</td><td>" + array[i].Quantity + "</td><td>" + array[i].AliasName + "</td><td>" + array[i].SizeName + "</td><td>" + array[i].categoryName + "</td></tr>";

                }
                row += "</tbody></table>";
                $("#PrintdivModal").html(row);
                //dtablebom();
            }

            else if (divid == 7) {
                var array = data.Data;
                console.log(array);

                $("#txtgrnnum").val(array[0].grnno);
                $("#txtchallannum").val(array[0].Challan_Number);
                $("#txtchdate").val(array[0].ChallanDate);
                $("#txtinvnum").val(array[0].InvoiceNo);
                $("#txtinvhdate").val(array[0].InvoiceDate);
                $("#txtponumber").val(array[0].PO_Number);
                //$("#txtsonumber").val(array[0].Amount);
                $("#ddlsupplier").val(array[0].SupplierId);

                for (var i = 0; i < array.length; i++) {
                    row += "<tr id='row" + i + "'><td>" + parseInt(i + 1) + "</td><td class='dtranid' style='display:none;'>" + array[i].TranDetailId + "</td><td style='display:none;' class='itemid'>" + array[i].Itemid + "</td><td><span class='itemname'>" + array[i].ItemName + "</span></td><td style='display:none;' class='groupid'>" + array[i].GroupId + "</td><td class='group' id='group" + i + "'>" + array[i].GroupName + "</td><td class='qnty'>" + parseFloat(array[i].POQnty) + "</td><td><input type='text' class='invo' value='" + array[i].InvoiceQuantity + "' /></td><td><input type='text' class='recqty' value='" + array[i].RecieveQuantity + "' /></td><td><input type='text' class='rate' id='rate" + i + "' value='" + array[i].Rate + "'/></td><td><input type='text' class='Amount' value='" + array[i].Amount + "'/></td></tr>";
                }

                $(".salebody").html(row);
                $("#btnadd").html('Update');


            }

            else if (divid == 8) {
                var array = data.Data;
                console.log(array);
                $("#txtHiddenId").val(array[0].tranid);
                for (var i = 0; i < array.length; i++) {

                    row += "<tr id='row" + i + "'><td>" + parseInt(i + 1) + "</td><td class='dtranid' style='display:none;'>" + array[i].TranDetailId + "</td><td>" + array[i].RequisitionNo + "</td><td class='sonum'>" + array[i].SO_Number + "</td><td style='display:none;' class='itemid'>" + array[i].ItemId + "</td><td class='bitem' id='bitem" + i + "'>" + array[i].BomItem + "</td><td><input type='text' id='reqquan" + i + "' class='reqquan' value='" + array[i].RequsitionQuantity + "' readonly /></td><td><input type='text' class='issuquan' value='" + array[i].RequsitionQuantity + "' onchange='chkIssuedQuan(this," + i + "," + array[i].ItemId + ")'  id='issue" + i + "' /></td><td><input type='text' class='toissuquan' value='" + array[i].TotalIssuedQuan + "'  id='totalissue" + i + "' readonly /></td></tr>";
                }

                $(".companybody").html(row);
            }
            else if (divid == 9) {
                if (data.Status == "error") {
                    alert(data.Message);
                }
                var rowlen = $('.companybody tr').length;
                var array = data.Data;

                var row = ""
                for (var i = 0; i < array.length; i++) {
                    row += "<tr id='row" + i + "'><td>" + parseInt(rowlen + 1) + "</td><td class='itemn'>" + array[i].ItemName + "</td><td style='display:none;'><span class='itemid'>" + array[i].ItemId + "</span></td><td><span class='BarCode'>" + array[i].BarCode + "</span></td><td><button type='button' onclick='Delete(" + i + ")' class='btn btn-danger'>Del</button></td></tr>";
                }

                $(".companybody").append(row);
                getitemCount();
            }
            else if (divid == 10) {
                if (data.Status == "error") {
                    alert(data.Message);
                }

                var array = data.Data;
                $("#txtcponumber").val(data.Data[0].Hid_csonumber);
                $("#ddlcustomer").val(data.Data[0].Hid_CustomerId);

            }
            else if (divid == 11) {
                if (data.Status == "error") {
                    alert(data.Message);
                    //msg = true;
                    $(".companybody").empty();
                }
                else {
                    //console.log(data.Data);
                    var array = data.Data;
                    //console.log(array);
                    $("#txtHiddenId").val(array[0].tranid);
                    for (var i = 0; i < array.length; i++) {

                        row += "<tr id='row" + i + "'><td>" + parseInt(i + 1) + "</td><td class='itemid' style='display:none;'>" + array[i].ItemID + "</td><td>" + array[i].ItemName + "</td><td class='ponum'>" + array[i].Ponumber + "</td><td><input type='text' id='lotid" + i + "' class='lotid'  /></td><td class='colorid' style='display:none;'>" + array[i].Colorid + "</td><td class='categoryid' style='display:none;'>" + array[i].Categoryid + "</td><td class='cate'>" + array[i].CategoryName + "</td></td><td class='color' id='color" + i + "'>" + array[i].ColorName + "</td><td><input type='text' id='lotquan" + i + "' class='lotquan' onchange='checkQuantity(this," + array[i].ItemID + "," + i + ")'/></td><td><select class='ress'><option value='0'>select</option><option value='1'>Pass</option><option value='2'>Fail</option></select></td><td><input type='text' class='remark' id='remark" + i + "'  /></td></tr>";


                    }
                    $(".companybody").html(row);
                }
            }

            else if (divid == 12) {
                console.log(data);
                if (data.Status == "error") {
                    alert(data.Message);
                    msg = true;
                }
            }
            else if (divid == 13) {
                console.log(data);
                if (data.Status == "error") {
                    //alert(data.Message);
                    msg = true;
                }
            }

            else if (divid == 14) {
                var array = data.Data;
                //console.log(array);
                $("#txtHiddenId").val(array[0].tranid);
                for (var i = 0; i < array.length; i++) {

                    row += "<tr id='row" + i + "'><td>" + parseInt(i + 1) + "</td><td class='itemid' style='display:none;'>" + array[i].ItemID + "</td><td>" + array[i].ItemName + "</td><td><input type='text' style='width: 406px;' id='barcode" + i + "' class='barcode' /></td></tr>";


                }
                $(".companybody").html(row);
            }
            else if (divid == 15) {
                var array = data.Data;
                $("#invent").html(array[0].AvailableQTY);
            }
            else if (divid == 16) {
                var array = data.Data;
                if (array[0].Tds == 0) {
                    $("#txttdsper").attr("readonly", true)
                }
                // $("#invent").html(array[0].AvailableQTY);
            }
            else if (divid == 17) {
                //var array = data.Data;
                if (data.Status == "error") {
                    alert(data.Message);
                    msg = data.Message;
                }
            }

            else {

                console.log(data.Data);
                $("#txtgrandtotal").val(data.Data[0].NetAmount);
                $("#txtponumber").val(data.Data[0].SO);
                $("#txtcponumber").val(data.Data[0]["Customer SO Number"]);
                //$("#txttotalamount").val(data.Data[0].SubTotal);
                $("#txtsonumber").val(data.Data[0].SO_Number);
                //$("#ddltax").val(data.Data[0].TaxID1);
                //$("#txttaxamount1").val(data.Data[0].TaxAmt1);
                $("#ddlreceivematerials").val(data.Data[0].RecieveMaterials);
                $("#ddlreversecharges").val(data.Data[0].RecieveCharges);
                //$("#ddltax").trigger("change");
                $("#txtpurchaseinvoicedate").val(data.Data[0].InvoiceDate);
                $("#txtHiddenId").val(data.Data[0].TranId);
                $("#txttrandid").val(data.Data[0].TranDetailId);
                $("#ddlcust").val(data.Data[0].SupplierID);
                $("#ddlcust").trigger('change');
                $("#txtbillto").val(data.Data[0].BillTo);
                $("#txtshipto").val(data.Data[0].ShipTo);
                $("#txtcreditterms").val(data.Data[0].CreditTerms);
                $("#txtpaymentterms").val(data.Data[0].PaymentTerms);
                $("#txttcsper").val(data.Data[0].TcsTaxPer);
                $("#txttcsamount").val(data.Data[0].TcsTaxAmt);
                $("#txttdsper").val(data.Data[0].TDS);
                $("#txttdsamount").val(data.Data[0].tdsAmt);
                $("#txtfrght").val(data.Data[0].Freight);
                $("#ddllqdam").val(data.Data[0].LiquidatedType);
                $("#txtlqdamage").val(data.Data[0].LiquidatedPer);
                //$("#txttdsamount").val(data.Data[0].Tdsamount);
                console.log(data.Data[0].sodate);
                $("#txtsodate").val(data.Data[0].sodate);
                $("#ddlcurrency").val(data.Data[0].Currency);
                //$("#txtpaymentduedate").val(data.Data[0].duedate);
                var tdi = data.Data[0].TranDetailId;
                if (data.Data[0].TranDetailId != undefined) {

                    for (var j = 0; j < data.Data.length; j++) {

                        var TranDetailId = data.Data[j].TranDetailId;
                        var RefNo = $('#txtrefno').val();
                        var ActualItem = data.Data[j].ActualItemName;
                        var ActualItemID = data.Data[j].ItemID;
                        //var Brand = $('#ddlbrand').find('option:selected').val();
                        //var PackingUnit = $('#ddlpackingUnit').find('option:selected').val();
                        var Quantity = data.Data[j].Quantity;
                        var Rate = data.Data[j].Rate;
                        var Amount = data.Data[j].Amount;
                        var Unit = data.Data[j].unitid;
                        var Tax1 = data.Data[j].Tax1;
                        var Tax2 = data.Data[j].Tax2;
                        var tax1amount = data.Data[j].Tax1Amount;
                        var tax2amount = data.Data[j].Tax2Amount;
                        var totalamount = data.Data[j].TotalAmount;
                        var dicountper = data.Data[j].DiscountPer;
                        var dicountamount = data.Data[j].DiscountAmt;
                        var finalamount = data.Data[j].FinalAmount;


                        if (j == data.Data.length - 1) {
                            i = j + 1;
                        }

                        /*var new_row = "<tr id='row" + j + "'><td><span class='RefNo'>" + parseInt(j + 1) + "</span></td><td style='display:none;'><span class='ActualItemID' id='ActualItemID" + j + "'>" + ActualItemID + "</span><span class='pkg1" + j + "'>" + pkg1 + "</span><span class='dtranid' id='TranDetailId" + j + "'>" + TranDetailId + "</span><span class='pkg2" + j + "'>" + pkg2 + "</span><span class='pkg3" + j + "'>" + pkg3 + "</span></td><td><span class='ActualItem'>" + ActualItem + "</span></td><td><span class='Quantity' id='Quantity" + j + "'>" + Quantity + "</span></td><td><span id='Rate" + j + "' class='Rate'>" + Rate + "</span></td><td><span id='Amount" + j + "' class='Amount'>" + Amount + "</span></td><td><button type='button' class='btn btn-primary' onclick='editBy(" + j + ")' >Edit</button></td><td><button type='button' onclick='Delete(" + j + "," + TranDetailId + ")' class='btn btn-danger'>Del</button></td></tr>";*/

                        var new_row = "<tr id='row" + j + "'><td><span class='RefNo'>" + parseInt(j + 1) + "</span></td><td style='display:none;'><span class='Tax1' id='Tax1" + j + "'>" + Tax1 + "</span><span class='Tax2' id='Tax2" + j + "'>" + Tax2 + "</span><span class='Amount' id='Amount" + j + "'>" + Amount + "</span><span class='dicountper' id='dicountper" + j + "'>" + dicountper + "</span><span class='finalamount' id='finalamount" + j + "'>" + finalamount + "</span><span class='PackingUnit' id='PackingUnit" + j + "'>" + Unit + "</span><span id='ActualItemID" + j + "' class='ActualItemID'>" + ActualItemID + "</span></span><span class='dtranid' id='TranDetailId" + j + "'>" + TranDetailId + "</span></td><td><span class='ActualItem'>" + ActualItem + "</span></td><td><span class='Quantity'id='Quantity" + j + "'>" + Quantity + "</span></td><td><span id='Rate" + j + "' class='Rate'>" + Rate + "</span></td><td><span class='dicountamount' id='dicountamount" + j + "'>" + dicountamount + "</span></td><td><span class='tax1amount' id='tax1amount" + j + "'>" + tax1amount + "</span></td><td><span class='tax2amount' id='tax2amount" + j + "'>" + tax2amount + "</span></td><td><span class='totalamount' id='totalamount" + j + "'>" + totalamount + "</span></td><td><button type='button' class='btn btn-primary' onclick='editBy(" + j + ")' >Edit</button></td><td><button type='button' onclick='Delete(" + j + ")' class='btn btn-danger'>Del</button></td></tr>";

                        if (currentRow) {
                            $("table tbody.salebody").find($(currentRow)).replaceWith(new_row);
                        }
                        else {
                            $("table tbody.salebody").append(new_row);
                            currentRow = null;
                        }
                    }
                    CalTotalAmount();
                }
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




function CommonAjaxBom(var_url, var_data, var_type, var_ct, var_dt, encrp, divid) {

    if (var_type == "")
        var_type = "POST";

    if (var_ct == "")
        var_ct = "application/json;charset=utf-8";

    if (var_dt == "")
        var_dt = "json";

    $.ajax({
        url: var_url,
        data: { jsonData: var_data, UrlEncript: encrp },
        type: var_type,
        //contentType: var_ct,
        dataType: var_dt,
        success: function (data) {
            console.log(data);
            if (data.Message != "") {
                swal("Message", data.Message, data.Message == "Success" ? "success" : "error");
            }
            if (data.Message == "Success") {
                clear();
            }
            if (data.Data != undefined) {
                CreateTableFromArray(data.Data, divid);
                //dtable();
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


function Common(var_url, var_data, var_type, var_ct, var_dt, type) {

    if (var_type == "")
        var_type = "POST";

    if (var_ct == "")
        var_ct = "application/json;charset=utf-8";

    if (var_dt == "")
        var_dt = "json";

    $.ajax({
        url: var_url,
        data: var_data,
        type: var_type,
        //contentType: var_ct,
        dataType: var_dt,
        success: function (data) {
            //console.log(data);
            CalculateTaxAmount(data, type);
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


function BindDropdown(var_url, var_data, var_type, var_ct, var_dt, var_id) {
    if (var_type == "")
        var_type = "POST";

    if (var_ct == "")
        var_ct = "application/json;charset=utf-8";

    if (var_dt == "")
        var_dt = "json";

    $.ajax({
        type: var_type,
        url: var_url,
        data: var_data,
        async: false,
        success: function (json, result) {
            $(var_id).empty();
            json = json || {};
            $(var_id).append('<option value="0">Select</option>');
            for (var i = 0; i < json.length; i++) {
                $(var_id).append('<option value="' + json[i].value + '">' + json[i].text + '</option>');
            }

        },
        error: function () {
            alert("Data Not Found");
        }
    });
}

function saveWithFile(var_url, var_data, var_type, var_ct, var_dt) {
    if (var_type == "")
        var_type = "POST";

    if (var_ct == "")
        var_ct = "application/json;charset=utf-8";

    if (var_dt == "")
        var_dt = "json";

    $.ajax({
        url: var_url,
        type: var_type,
        contentType: false,
        processData: false,
        data: var_data,
        success: function (data) {
            console.log(data);
            if (data.Message != "") {
                swal("Message", data.Message, data.Message == "Success" ? "success" : "error");
            }
            if (data.Message == "Success") {
                clear();
            }
            if (data.Data != undefined) {
                CreateTableFromArray(data.Data, "Printdiv");
                dtable();
            }
        },
        error: function (err) {
            alert(err.statusText);
        }
    });
}

function BindTextbox(var_url, var_data, var_type, var_ct, var_dt, var_id) {
    if (var_type == "")
        var_type = "POST";

    if (var_ct == "")
        var_ct = "application/json;charset=utf-8";

    if (var_dt == "")
        var_dt = "json";


    $.ajax({
        url: var_url,
        data: var_data,
        type: var_type,
        //contentType: var_ct,
        dataType: var_dt,
        success: function (data) {
            if (var_id != "") {
                console.log(data);
                var data1 = JSON.parse(data)
                $(var_id).val(data1[0].SupplierID);
            }
            else {
                var data1 = JSON.parse(data)
                //console.log(data1[0].Challan_Number);
                $("#txtnoofitem").val(data1[0].NofFItem);
                $("#txtamount").val(data1[0].Amount);
                $("#ddlsupplier").val(data1[0].Supplierid);
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

function CreateTableFromArray(arrItems, divid) {
    let col = [];
    for (let i = 0; i < arrItems.length; i++) {
        for (let key in arrItems[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // Create a Table.
    let table = document.createElement("table");
    table.setAttribute('id', 'data-table');
    table.setAttribute('class', 'table table-bordered');
    // Create table header row.

    let tr = table.insertRow(-1);		// table row.

    for (let i = 0; i < col.length; i++) {
        let th = document.createElement('th');  // table header.
        //console.log(col[i]);
        th.innerHTML = col[i];
        var result = col[i].includes("Hid_") == true ? 'none' : '';
        tr.appendChild(th);
        th.setAttribute('style',
            'font:18px Calibri;border: solid 1px #DDD;' +
            'border-collapse: collapse; font-weight:bold;' +
            'padding: 2px 3px; text-align: center;' +
            'display:' + result + ';'
        );
    }

    // Add JSON to the table as rows.
    for (let z = 0; z < arrItems.length; z++) {
        tr = table.insertRow(-1);

        for (let j = 0; j < col.length; j++) {
            let tabCell = tr.insertCell(-1);
            var result = col[j].includes("Hid_") == true ? 'none' : '';
            tabCell.innerHTML = arrItems[z][col[j]];
            tabCell.setAttribute('style',
                'font:18px Calibri;border: solid 1px #DDD;' +
                'border-collapse: collapse; ' +
                'padding: 2px 3px; text-align: center;' +
                'display:' + result + ';'
            );
            tabCell.setAttribute('class', "" + col[j].replace(" ", "") + "");
            tabCell.setAttribute('id', "" + col[j].replace(" ", "") + "" + z + "");

        }
    }

    // Show the table.
    let container = document.getElementById('' + divid + '');
    container.innerHTML = '';
    container.appendChild(table);


    //jQuery.noConflict();
    //(function ($jq) {
    //    var myTable = $jq("#data-table");
    //    var thead = myTable.find("thead");
    //    var thRows = myTable.find("tr:has(th)");
    //    if (thead.length === 0) {  //if there is no thead element, add one.
    //        thead = $jq("<thead></thead>").appendTo(myTable);
    //    }
    //    var copy = thRows.clone(true).appendTo("thead");
    //    thRows.remove();
    //    myTable.dataTable();
    //})(jQuery);


}

function getFileUrl(fileId, folder) {
    var currentdate = new Date();
    var currdate = currentdate.getDate() + "" + currentdate.getMonth() + "" + currentdate.getFullYear() + "" + currentdate.getHours() + "" + currentdate.getMinutes() + "" + currentdate.getSeconds() + "" + currentdate.getMilliseconds();
    var filename = $(fileId).val();
    var name = filename.substr(0, filename.lastIndexOf('.'));
    var dataimg = name.split("\\");
    var extension = filename.replace(/^.*\./, '');
    var url_add = window.location.href;
    var data = url_add.split("://")
    var protocol = data[0];
    data = data[1].split("/");
    var domain = data[0];
    //var urlimd = protocol + "://" + domain + "/" + folder + "/" + dataimg[2] + currdate + "." + extension;
    var urlimd = dataimg[2] + currdate + "." + extension;
    //console.log(urlimd);
    return { url: urlimd, fname: dataimg[2] + currdate + "." + extension };
}

function fnLoadVotesForm() {

    var STATE_code = $("#trntype").val();;


    var URL = '/Transcation/_UploadPartialView?id=' + STATE_code + '';
    $.ajax({
        type: "GET",
        //contentType: "application/json; charset=utf-8",
        url: URL,
        data: "{}",
        dataType: 'html',
        success: function (data) {
            //console.log(data);
            $("#Printdivfile").html(data)
        },
        error: function (result) {

        }
    });



}

function getfile() {
    url_add = window.location.href;
    var data = url_add.split("://");
    data = data[1].split("/");
    var menuname = data[1] + "/" + data[2];
    var url_add = window.location.protocol + "//" + window.location.host + "/";
    var url = url_add + 'api/ApiServices/SaveTransactions';
    var Hid_Con = $("#cid").val() + "##" + $("#UserId").val() + "##" + menuname + "##" + $("#flgmode").val();
    //if ($("#txtsonumber").val() == "") {
    //	alert("Enter SO Number !!");
    //	$("#ddlitem").val(0);
    //}
    //else {
    var Data = {

        trntype: $("#trntype").val(),
        trnid: $("#trnid").val(),
        type: 121
    }

    CommonAjaxBom(url, JSON.stringify(Data), "", "", "", "", "PrintdivModal");
    //}
}

//--------------------------


//document.addEventListener('DOMContentLoaded', function () {
//    var select = document.getElementById('ddlmonth');

//    // Function to generate options
//    function populateMonthsYears() {
//        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
//            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//        var currentYear = new Date().getFullYear();
//        var startYear = currentYear - 3; // Adjust as needed for the range of years

//        for (var year = startYear; year <= currentYear; year++) {
//            for (var month = 0; month < months.length; month++) {
//                var option = document.createElement('option');
//                option.value = months[month] + ' ' + year;
//                option.textContent = months[month] + ' ' + year;
//                select.appendChild(option);
//            }
//        }
//    }

//    // Call the function to populate the dropdown
//    populateMonthsYears();
//});

function GenereteReceiptNo() {
    var now = new Date();

    var year = now.getFullYear();
    var month = padZero(now.getMonth() + 1);
    var day = padZero(now.getDate());
    var hours = padZero(now.getHours());
    var minutes = padZero(now.getMinutes());
    var seconds = padZero(now.getSeconds());
    var milliseconds = padZero(now.getMilliseconds(), 3);


    var formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

    return formattedDate;
}


function padZero(number, length = 2) {
    return (Array(length).join('0') + number).slice(-length);
}


//var GeneretedReceiptNo = GenereteReceiptNo();
//console.log(formattedDateTime);




//function exportexcel(FileName) {
//    var elt = document.getElementById('data-table');

//    // Clone table to avoid altering original
//    var clonedTable = elt.cloneNode(true);
//    var rows = clonedTable.querySelectorAll('tr');
//    let columnsToRemove = new Set();

//    // Identify columns to remove (e.g., "Hid_" or "Action")
//    rows.forEach(row => {
//        let cells = Array.from(row.children);
//        cells.forEach((cell, index) => {
//            let text = cell.textContent.trim();
//            if (text.startsWith("Hid_") || text.startsWith("Action")) {
//                columnsToRemove.add(index);
//            }
//        });
//    });

//    // Remove marked columns
//    rows.forEach(row => {
//        let cells = Array.from(row.children);
//        cells.forEach((cell, index) => {
//            if (columnsToRemove.has(index)) {
//                cell.remove();
//            }
//        });
//    });

//    // Convert table to worksheet
//    var wb = XLSX.utils.book_new();
//    var ws = XLSX.utils.table_to_sheet(clonedTable);

//    // === Style the header row ===
//    const range = XLSX.utils.decode_range(ws['!ref']);
//    for (let C = range.s.c; C <= range.e.c; ++C) {
//        const cell_address = XLSX.utils.encode_cell({ c: C, r: 0 });
//        if (!ws[cell_address]) continue;

//        // Add bold + background color
//        ws[cell_address].s = {
//            backgroud:"red",
//            font: { bold: true, color: { rgb: "FFFFFF" } },
//            fill: { fgColor: { rgb: "4F81BD" } },
//            alignment: { horizontal: "center" }
//        };
//    }

//    // === Auto-fit column width ===
//    const colWidths = [];
//    for (let C = range.s.c; C <= range.e.c; ++C) {
//        let maxLen = 10; // minimum width
//        for (let R = range.s.r; R <= range.e.r; ++R) {
//            const cell_address = XLSX.utils.encode_cell({ c: C, r: R });
//            const cell = ws[cell_address];
//            if (cell && cell.v) {
//                const len = cell.v.toString().length;
//                if (len > maxLen) maxLen = len;
//            }
//        }
//        colWidths.push({ wch: maxLen + 2 });
//    }
//    ws['!cols'] = colWidths;

//    // Append to workbook and export
//    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
//    XLSX.writeFile(wb, FileName + '.xlsx');
//}





function exportexcel(fileName) {
    const table = document.getElementById("data-table").cloneNode(true);
    const rows = table.querySelectorAll("tr");
    const columnsToRemove = new Set();

    // Identify columns to remove (e.g., starts with Hid_ or Action)
    rows[0].querySelectorAll("th, td").forEach((cell, index) => {
        const text = cell.textContent.trim();
        if (text.startsWith("Hid_") || text.startsWith("Action")) {
            columnsToRemove.add(index);
        }
    });

    // Remove marked columns
    rows.forEach(row => {
        Array.from(row.children).forEach((cell, idx) => {
            if (columnsToRemove.has(idx)) cell.remove();
        });
    });

    // Convert cleaned table to worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(table);

    // Style the header row (only works with xlsx-style)
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const addr = XLSX.utils.encode_cell({ c: C, r: 0 });
        if (ws[addr]) {
            ws[addr].s = {
                fill: {
                    fgColor: { rgb: "4F81BD" },
                    patternType: "solid"
                },
                font: {
                    bold: true,
                    color: { rgb: "FFFFFF" }
                },
                alignment: {
                    horizontal: "center"
                },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            };
        }
    }

    // Auto column width
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxLen = 10;
        for (let R = range.s.r; R <= range.e.r; ++R) {
            const addr = XLSX.utils.encode_cell({ c: C, r: R });
            const cell = ws[addr];
            if (cell && cell.v) {
                const len = cell.v.toString().length;
                if (len > maxLen) maxLen = len;
            }
        }
        colWidths.push({ wch: maxLen + 2 });
    }
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileName + ".xlsx");
}


