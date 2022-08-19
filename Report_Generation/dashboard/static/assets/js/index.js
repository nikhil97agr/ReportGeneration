$(document).ready(() => {
    
    $("#account_nums").on('change', function () {
        const acc = $(this).val()
        if (acc === 'default') {
            $("#transactions_table tbody tr").show()
        }
        else {
            $("#transactions_table tbody tr").hide()

            $(`#transactions_table tbody tr[name=${acc}]`).show()
        }
    })
    
    $("#search").click(() => {
        const member_id = $("#member_id").val();

        if (member_id.trim() === "") {
            alert("Member ID required");
            return;
            
        }
        $("#overlay").show()
        const url = $("#url").val()
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify({ member_id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: response => {
                
                statuscode = response.status_code
                if (statuscode == 0) {
                    render_table(response.data).then(data => { })
                    .catch(err=>{ })
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


const render_table = async (data) => {

    $("#transactions_table tbody").empty()
    if (data.length == 0) {
        $("#transactions_table tbody").append(`<tr>
                        <td colspan="8" id="no_data">No Data Available</td>
                    </tr>`)
        $("#overlay").hide()

        return true;
    }

    accounts = []

    $(data).each((index, obj) => {
        if ($.inArray(obj.fields.acc_num, accounts)==-1) {
                accounts.push(obj.fields.acc_num)
        }

        $("#transactions_table tbody").append(`<tr name="${obj.fields.acc_num}">
                        <td>${obj.pk}</td>
                        <td>${obj.fields.acc_num}</td>
                        <td>${obj.fields.date}</td>
                        <td>${obj.fields.amount}</td>
                        <td>${obj.fields.crdr}</td>
                        <td>${obj.fields.transaction_type}</td>
                        <td>${obj.fields.rule}</td>
                        <td>${obj.fields.trans_type_name}</td>
                    </tr>`)

    })

    $("#account_nums")
        .empty()                           
        .append(`<option value = default>All Data</option>`)
    
    $(accounts).each((index, obj) => {
        $("#account_nums").append(`<option value = ${obj}>${obj}</option>`)
    })

    $("#overlay").hide()

    $(document).animate({
        scrollTop: $('#transactions_table').offset().top
    },
        Math.abs(window.scrollY - $('#transactions_table').offset().top) * 10 )
    return true;


    
}