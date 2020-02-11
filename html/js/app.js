// global variables 
let decp = ['First Name', 'Last Name', 'Email', 'Phone Number',
    'Sex', 'Projects', 'Country', 'State', 'skill'
];
// iife 
$(function () {
    // masking number 
    $('input[name="pno"]').mask('00000-00000');
    $.ajax({
        type: "GET",
        url: "https://api.myjson.com/bins/yllpi",
        data: "data",
        dataType: "JSON",
        success: function (response) {
            console.log(response);
            for (let i in response['countries']) {
                $("#country").append($("<option></option>").val(response['countries'][i]['country']).html(response['countries'][i]['country']));
            }
        }
    });

    // validations of form 
    $("#myform").validate({
        rules: {
            fname: { required: true, minlength: 2 },
            lname: { required: true, minlength: 2 },
            email: { required: true, email: true, minlength: 2 },
            pno: { required: true, numberOnly: true, minlength: 11, maxlength: 11 },
            sex: { required: true },
            projects: { required: true },
            country: { required: true },
            state: { required: true }
        },
        messages: {
        }
    })

});


$("#country").change(function (e) {
    e.preventDefault();
    let cur = $(this).val();
    $.ajax({
        type: "GET",
        url: "https://api.myjson.com/bins/yllpi",
        data: "data",
        dataType: "JSON",
        success: function (response) {

            for (let i in response['countries']) {
                if (response['countries'][i]['country'] == cur) {
                    let states = response['countries'][i]['states'];
                    putStates(states);
                    break;
                }
            }

        }
    });

});
// dynamic Add-skill
$("#add-skill").click(function (e) {
    e.preventDefault();
    $("#inp").append(
        `<div><input type="text" placeholder="Input Skill"> ${del()} </div>`
    ).on('click', 'input:button', function () {
        $(this).parent().hide();
    });

});

function del() {
    str = "<input type='button'  value='delete'>"
    return str;
}


//  insert states in select box 
function putStates(arr) {

    $("#state").html(putStr(arr));

}
// show modal or alert box
$("#btn-submit").click(function (e) {
    e.preventDefault();
    if ($("#myform").valid()) { getdata(); }
})
// get data form from 
function getdata() {
    let out = []
    out.push($("#fname").val());
    out.push($("#lname").val());
    out.push($("#email").val());
    out.push($("#pno").val());
    out.push($("input[name='sex']:checked").val());
    out.push($("#projects").val());
    out.push($("#country").val());
    out.push($("#state").val());
    out.push("empty");
    putdata(out)
    $("#alert-modal").modal('show');
}
//get skill added dynamicly
$("#inp input:button").click(function (e) { 
    e.preventDefault();
    console.log("click");
});
// put data in modal table 
function putdata(arr) {
    $(".table tbody").html(
        putTr(arr)
    );
}

function putTr(arr) {
    str = "";
    for (let i in arr) {
        str += `<tr><td>${decp[i]}</td> <td>${arr[i]}</td></tr>`
    }
    return str;
}

function putStr(arr) {
    let str = "<option value=''>Select State</option>";
    for (let i of arr) {
        str += `<option value=${i}>${i}</option>`
    }
    return str;
}
//end table contents 

$("#save-changes").click(function (e) {
    e.preventDefault();
    $("#myform")[0].reset();
    $("#alert-modal").modal('hide');
});

// custom validations
jQuery.validator.addMethod("numberOnly", function (value, element) {
    let regex = new RegExp(/[0-9]/);
    return (value.match(regex));
}, "Not A number");