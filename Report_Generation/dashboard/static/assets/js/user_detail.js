var mem_prev_user = ""

$(document).ready(() => {
    $("#search").click(() => {
        const member_id = $("#member_id").val();



        if (member_id.trim() === "") {

            return;

        }
        if (mem_prev_user === member_id) {




            return;
        }
        mem_prev_user = member_id;
        $("#overlay").show()
        const url = $("#user_url").val()
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify({ member_id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: response => {

                statuscode = response.status_code
                if (statuscode == 0) {
                    const data = response.user[0].fields
                    $("#mem_num_disp").html(data.mem_num)
                    $("#name").html(data.mem_name)
                    $("#reg_mob_num").html(data.reg_mobile)
                    $("#date_sign_up").html(data.DateSignup)
                    $("#address").html(data.address)
                    $("#whatsapp_mobile").html(data.whatsapp_mobile)
                    $("#field_officer").html(data.field_office)
                    $("#group_number").html(data.group_num)
                    $("#group_name").html(data.group_name)
                    $("#center").html(data.center_name)
                    $("#branch").html(data.branch_name)
                    $("#community").html(data.community)
                    
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
})