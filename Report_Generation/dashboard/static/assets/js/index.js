var mem_prev="";

$(document).ready(() => {
    $("#transaction_btn").click(()=>{
        var attr = $('#account_state').attr('hidden');
        console.log(attr)
        if(typeof attr !== 'undefined' || attr !== false){
            $('#account_btn').css('background-color','#607EAA')
            $("#account_state").attr("hidden",true)
        }
        $('#transaction_btn').css('background-color','#00008C')
        $("#transactions_table").attr("hidden",false)
    })
    $("#account_btn").click(()=>{
        var attr = $('#transactions_table').attr('hidden');
        console.log(attr)
        if(typeof attr !== 'undefined' || attr !== false){
            $('#transaction_btn').css('background-color','#607EAA')
            $("#transactions_table").attr("hidden",true)
        }
        $('#account_btn').css('background-color','#00008C')
        $("#account_state").attr("hidden",false)
    })
    $("#month_filter").on('change', function(){
        const date = $(this).val()
        const acc = $("#account_nums").val()

        var end_date=$("#end_date").val();
    var start_date= $("#start_date").val();
    if(start_date ===""){
        start_date="1960-01-01";
        
    }
    if(end_date === ""){
        var d = new Date();
        end_date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
        
    }

    if(date==='default'){
        apply_date_filter(start_date, end_date, acc)
    }else{
        [month, year] = date.split("-")
        start_date =`${year}-${month}-1`
        end_date=`${year}-${month}-31`
        apply_date_filter(start_date, end_date, acc)
    }
    })

    $("#account_nums").on('change', function () {
        const acc = $(this).val()
    var end_date=$("#end_date").val();
    var start_date= $("#start_date").val();
    if(start_date ===""){
        start_date="1960-01-01";
        
    }
    if(end_date === ""){
        var d = new Date();
        end_date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
        
    }
    var date = $("#month_filter").val()
    if(date==='default'){
        apply_date_filter(start_date, end_date, acc)
    }else{
        [month, year] = date.split("-")
        start_date =`${year}-${month}-1`
        end_date=`${year}-${month}-31`
        apply_date_filter(start_date, end_date, acc)
    }
        if (acc === 'default') {
            apply_date_filter(start_date, end_date)
            // $("#transactions_table tbody tr").show()
        }
        else {
            // $("#transactions_table tbody tr").hide()
            apply_date_filter(start_date, end_date, acc);
            // $(`#transactions_table tbody tr[name=${acc}]`).show()
        }
    })
    
    $("#search").click(() => {
        const member_id = $("#member_id").val();
        
        var start_date= $("#start_date").val();
        var end_date=$("#end_date").val();
        if(start_date ===""){
            start_date="1960-01-01";
            
        }
        if(end_date === ""){
            var d = new Date();
            end_date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
            
        }

        if (member_id.trim() === "" ) {
            alert("Member ID required");
            
            return;
            
        }
        if(mem_prev===member_id){
        const acc = $("#account_nums").val()
        $("#month_filter").val('default')
        toggle_month_filter(start_date, end_date);

        apply_date_filter(start_date, end_date, acc);
        
            return;
        }
        mem_prev=member_id;
        
        $("#overlay").show()
        const url = $("#url").val()
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify({ member_id,start_date,end_date }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: response => {
                
                statuscode = response.status_code
                if (statuscode == 0) {
                    render_table(response.data, start_date, end_date).then(data => { })
                    .catch(err=>{$("#overlay").hide()
                console.log(err) })
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


const render_table = async (data, start_date, end_date) => {

    $("#transactions_table tbody").empty()
    $("#transactions_table tbody").append(`<tr id="no_data"  style="display:none;" >
                        <td colspan="8" >No Data Available</td>
                    </tr>`)
    if (data.length == 0) {
        $("#no_data").show();
        $("#overlay").hide()

        return true;
    }

    accounts = []
    dates=[]
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
        var d = new Date(obj.fields.date)
        
        const final_date = d.toLocaleString('default', { month: 'long' })+'-'+d.getFullYear();
        if($.inArray(final_date,dates)==-1){
            dates.push(final_date)
        }

    })
    $("#account_nums")
        .empty()                           
        .append(`<option value = default>All Data</option>`)
    
    $(accounts).each((index, obj) => {
        $("#account_nums").append(`<option value = ${obj}>${obj}</option>`)
    })
    $("#month_filter")
        .empty()                           
        .append(`<option value = default>All Data</option>`)
    
    $(dates).each((index, obj) => {
        $("#month_filter").append(`<option value = ${obj}>${obj}</option>`)
    })
    
     toggle_month_filter(start_date, end_date)
     apply_date_filter(start_date, end_date)


    $("#overlay").hide()

  
    return true;


    
}

const apply_date_filter = (start_date, end_date, acc_name = 'default')=>{

     var rows = '';
     $("#transactions_table tbody tr").hide()
     if(acc_name==='default'){
        rows = $("#transactions_table tbody tr")
     }
     else{
       rows =  $(`#transactions_table tbody tr[name=${acc_name}]`)


     }

     var data_exist = false;
     start_date = new Date(start_date)
        end_date =new Date(end_date)
        console.log(start_date)
        console.log(end_date)
            $(rows).each(function(){
        const children = $(this).children()
        if(children.length<3){
            return;
        }
        
        var date = $(children)[2].innerHTML;
        date = new Date(date)
        date.setHours(0,0,0,0)
        if(date>=start_date && date<=end_date){
            $(this).show();
            data_exist = true;
        }

     })
     if(!data_exist){
        $("#no_data").show()
     }



}


const toggle_month_filter = (start_date, end_date)=>{
    $("#month_filter option").hide()
    $("#month_filter option[value=default]").show()
    start_date = Date.parse(start_date)
    end_date = Date.parse(end_date)
    $("#month_filter option").each((index, obj)=>{
        const value = $(obj).val()
        if(value==='default'){
            return;
        }
        else{
         [month, year ] =value.split("-")

         date1 =Date.parse(`${year}-${month}-1`)
         date2 =Date.parse(`${year}-${month}-31`)
         if(date2>=start_date && date1<=end_date){
            $(obj).show()
         }
        }
    })
}