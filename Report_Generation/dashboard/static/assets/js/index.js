$(document).ready(() => {

    var email_regex = new RegExp(/^\b[A-Za-z0-9]+\.[A-Za-z0-9]+@lntinfotech\.com\b$/i)
    $('form').validate({
        errorPlacement: (error, element) => {
            return true
        }
    })

    $(".title").click(() => location.reload(true))

    $("#show_pass").click(function () {
        $(this).toggleClass("fa-eye-slash")
        $(this).toggleClass("fa-eye")

        $("#password").attr("type", $(this).hasClass("fa-eye") ? 'text' : 'password')


    })

    $("#login").click(() => {
        const url = $("#verify_url").val()

        email = $("#email").val()
        password = $("#password").val()
        if (!$("#email").valid() || !email_regex.test(email)) {
            $("#email_required").show();
            return;
        }
        if (!$("#password").valid()) {
            $("#password_required").show();
            return;
        }

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify({email:email, password:password, type:"local"}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: response=> {
                const STATUS_CODE = response.status.status_code
                const MESSAGE = response.status.message
                if (STATUS_CODE == 1) {
                    alert(MESSAGE)
                    $('form').trigger('reset')
                } else {
                    save_session(response.expiry_time, response.token, response.user_id, response.role)
                    show_accounts(response.token, response.user_id, response.role)

                }
            },
            error: err => {
                alert("Something went wrong. Please try again later!!!")
            }
        });

    })


})


const save_session = (expiry_time, token, user_id, role) => {
    const SESSION = {
        expiry: expiry_time,
        token: token,
        userid: user_id,
        role: role
    }
    
    localStorage.setItem("roi_session", JSON.stringify(SESSION))
}

const show_accounts = (token, user_id, role) => {

    var url = $("#show_accounts").val();
    location.replace(`${window.location.protocol}//${location.host}${url}?token=${token}&user_id=${user_id}&role=${role}`)

    
}