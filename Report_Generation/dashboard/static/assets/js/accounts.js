var mem_prev_acc = "";
var acc_fetch = false;

$(document).ready(() => {


    $("#search").click(() => {
        const member_id = $("#member_id").val();
        var start_date = $("#start_date").val();
        var end_date = $("#end_date").val();
        if (start_date === "") {
            start_date = "1960-01-01";

        }
        if (end_date === "") {
            var d = new Date();
            end_date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

        }

        if (member_id.trim() === "") {

            return;

        }
        if (mem_prev_acc === member_id) {

            return;
        }
        mem_prev_acc = member_id;
        acc_fetch = false;
        $("#overlay").show()
        const url = $("#accounts_url").val()
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify({ member_id}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: response => {
                statuscode = response.status_code
                if (statuscode == 0) {
                    render_acc_table(response.acc, start_date, end_date).then(data => { })
                        .catch(err => {
                            $("#overlay").hide()
                            console.log(err)
                        })
                }
                else {
                    alert("Invalid member ID")
                    $("#overlay").hide()
                }

            },
            error: err => {
                alert("Something went wrong")
                $("#overlay").hide()
            }
        });


    })



});


const render_acc_table = async (data, start_date, end_date) => {

    $("#accounts_table tbody").empty()
    $("#accounts_table thead[thead-type=date_filter]").hide()
    $("#accounts_table ").append(`<tbody name=no_data>
    <tr id="no_data"  style="display:none;" >
                        <td colspan="12" >No Data Available</td>
                    </tr>
                    </tbody>`)
    acc_fetch = true
    if (data.length == 0) {
        $("#no_data").show();
        if (transaction_data_fetch && acc_data_fetch && acc_fetch)
            $("#overlay").hide()
        // $("#account_nums1")
        //     .empty()
        //     .append(`<option value = default>All Data</option>`)
        // $("#transactions_table thead[thead-type=date_filter]").empty()
        return true;
    }

    accounts = []
    dates = []
    $(data).each((index, obj) => {

    

 
        $(`#accounts_table`).append(`<tr>
        <td>${obj.fields.mem_num}</td>
        <td>${obj.pk}</td>
                        <td>${obj.fields.date_of_opening}</td>
                        <td>${obj.fields.acc_type}</td>
                        <td>${obj.fields.mem_memtype}</td>
                        <td>${obj.fields.acc_num_vir}</td> 
                        <td>${obj.fields.ifsc_virtual}</td>
                        <td>${obj.fields.loan_amount}</td>
                        <td>${obj.fields.tenure}</td> 



                    </tr>`)


    })
    dates = []
    // $("#account_nums1")
    //     .empty()
    //     .append(`<option value = default>All Data</option>`)

    // $(accounts).each((index, obj) => {
    //     $("#account_nums1").append(`<option value = ${obj}>${obj}</option>`)

    // })



    // apply_date_filter_acc_state(start_date, end_date)

    if (transaction_data_fetch && acc_data_fetch && acc_fetch)
        $("#overlay").hide()


    return true;



}

// const apply_date_filter_acc_state = (start_date, end_date, acc_name = 'default') => {

//     var rows = '';
//     $("#account_state tbody tr").hide()
//     $("#account_state thead[thead-type=date_filter]").hide()

//     if (acc_name === 'default') {
//         rows = $("#account_state tbody tr")
//     }
//     else {
//         rows = $(`#account_state tbody tr[name=${acc_name}]`)


//     }

//     var data_exist = false;
//     start_date = new Date(start_date)
//     end_date = new Date(end_date)
//     dates = []
//     $(rows).each(function () {
//         const children = $(this).children()
//         if (children.length < 3) {
//             return;
//         }

//         var date = $(children)[2].innerHTML;
//         date = new Date(date)
//         date.setHours(0, 0, 0, 0)

//         if (date >= start_date && date <= end_date) {
//             const row_date = date.toLocaleString('default', { month: 'long' }) + '-' + date.getFullYear();
//             if ($.inArray(row_date, dates) == -1) {
//                 dates.push(row_date)
//                 $(`#account_state thead[name=${row_date}]`).show()

//             }
//             $(this).show();
//             data_exist = true;
//         }

//     })
//     if (!data_exist) {
//         $("#no_data").show()
//     }



// }


// const toggle_month_filter = (start_date, end_date)=>{
//     $("#month_filter option").hide()
//     $("#month_filter option[value=default]").show()
//     start_date = Date.parse(start_date)
//     end_date = Date.parse(end_date)
//     $("#month_filter option").each((index, obj)=>{
//         const value = $(obj).val()
//         if(value==='default'){
//             return;
//         }
//         else{
//          [month, year ] =value.split("-")

//          date1 =Date.parse(`${year}-${month}-1`)
//          date2 =Date.parse(`${year}-${month}-31`)
//          if(date2>=start_date && date1<=end_date){
//             $(obj).show()
//          }
//         }
//     })
// }