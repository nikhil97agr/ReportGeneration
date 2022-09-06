
var mem_prev_all = "";
var data_fetched = false;
$(document).ready(() => {

    $("#overlay_close").click(() => {
        $("#table_overlay").hide();
    })
    $("#search").click(() => {
        const member_id = $("#member_id").val();



        if (member_id.trim() === "") {

            return;

        }
        if (mem_prev_all === member_id) {




            return;
        }
        mem_prev_all = member_id;
        $("#overlay").show()
        data_fetched = false;
        const url = $("#all_details_url").val()
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify({ member_id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: response => {

                statuscode = response.status_code
                if (statuscode == 0) {
                   
                    populate_data(response.data);
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


    // register_click_acc("account_name", "account_name_year");
    // register_click_acc("account_name_2020", "account_name_2020_month");
    // register_click_acc("account_name_2021", "account_name_2021_month");
})





const register_click_acc = (id, child) => {
    $(`#${id}`).click(() => {
        $(`#${child}`).slideToggle();

        $(`#${id} i`).toggleClass('fa-angle-right').toggleClass('fa-angle-down');
    })
}


const separate_year_month = (data) => {
    result = new Map()
    $.each(data, (key, value) => {
        const date = new Date(key)
        const month =date.toLocaleString('en-US', {
            month: 'long',
        });
        const year = date.getFullYear();
        if (year in result) {
            var months = result[year] 
            months[month] = [value[0], value[1]]
        } else {
            result[year] = new Map()
            result[year][month] = [value[0], value[1]]
        }
    });
    return result
}

const populate_data = (data) => {
    $("#acc_state_trans").empty();
    $.each(data, (key, value) => {
        const years = []
        const table_data = {}
        var temp = `<div class="row">
            <div class="col-lg-1 col-md-1"></div>
            <div class="col-lg-11 col-md-11 col-sm-12 col-xs-12">
                <label id="${key}"><i class="fa fa-angle-right">${key}</i></label>
                <div id="${key}_year" name="year">`;

        // register_click_acc(key, `${key}_year`);
        const year_month_mapping = separate_year_month(value.data);

        $.each(year_month_mapping, (year, year_data) => {
                    temp+= `
                    <div class="row">
                        <div class="col-lg-1 col-md-1"></div>
                        <div class="col-lg-11 col-md-11 col-sm-12 col-xs-12">
                            <label id="${key}_${year}"><i class="fa fa-angle-right">${year}</i></label>
                            <div id="${key}_${year}_month" name="month">`

            years.push(year)
            // register_click_acc(`${key}_${year}`, `${key}_${year}_month`);
            $.each(year_data, (month, month_data) => {
               temp+= `<div class="row">
                                    <div class="col-lg-1 col-md-1"></div>
                                    <div class="col-lg-11 col-md-11 col-sm-12 col-xs-12">
                                        <label id="${key}_${year}_${month}">${month}</label>

                                    </div>
                                </div>`

                table_data[`${key}_${year}_${month}`] = month_data;
            })
            temp+= `</div>
                        </div>

                    </div>`


               
            })
           
        temp += ` </div>
            </div>
        </div>`;

        $("#acc_state_trans").append(temp);
        register_click_acc(key, `${key}_year`);
        $.each(years, (idx, obj) => {
            register_click_acc(`${key}_${obj}`, `${key}_${obj}_month`);
        })

        $.each(table_data, (key, value) => {
            populate_table(key, value);
        })
    })




}


const populate_table = (id, data) => {
    $(`#${id}`).click(() => {
        $("#table_overlay").show();
        $("#account_state_overlay").empty();
        $("#transactions_table_overlay").empty();
        const acc_state = data[0];
        const transaction = data[1];
        $("#account_state_overlay").append(`
            <tr>
            <td>${acc_state.id}</td>
            <td>${acc_state.account_number}</td>
            <td>${acc_state.date_of_update}</td>
            <td>${acc_state.balance_ob}</td>
            <td>${acc_state.due}</td>
            <td>${acc_state.overdue_ob}</td>
            <td${acc_state.PanelCharge}</td>
            <td>${acc_state.TotalCharge}</td>
            <td>${acc_state.TransferIn_CB}</td>
            <td>${acc_state.TransferOut_CB}</td>
            <td>${acc_state.balance_cb}</td>
            <td>${acc_state.Overdue_CB}</td>
            </tr>
        
        `)


        $.each(transaction, (idx, obj) => {
            $("#transactions_table_overlay").append(
                `<tr>
                <td>${obj.id}</td> 
                <td>${obj.acc_num}</td> 
                <td>${obj.date}</td> 
                <td>${obj.amount}</td> 
                <td>${obj.crdr}</td> 
                <td>${obj.transaction_type}</td> 
                <td>${obj.rule}</td> 
                <td>${obj.trans_type_name}</td> 
                </tr>`
            )
        })
        console.log(id,transaction)
    });
}


