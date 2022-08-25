

var mem_prev = "";
var transaction_data_fetch = false;

$(document).ready(() => {
    $("#transaction_btn").click(()=>{
        var attr = $('#account_state').attr('hidden');
        if(typeof attr !== 'undefined' || attr !== false){
            $('#account_btn').css('background-color','#607EAA')
            $("#account_state").attr("hidden",true)
        }
        $('#transaction_btn').css('background-color','#00008C')
        $("#transactions_table").attr("hidden",false)
    })
    $("#account_btn").click(()=>{
        var attr = $('#transactions_table').attr('hidden');
        if(typeof attr !== 'undefined' || attr !== false){
            $('#transaction_btn').css('background-color','#607EAA')
            $("#transactions_table").attr("hidden",true)
        }
        $('#account_btn').css('background-color','#00008C')
        $("#account_state").attr("hidden",false)
    })
   

    $("#account_nums").on('change', function () {
        const acc = $(this).val()
        $("#transactions_table thead[thead-type=date_filter]").hide()
    var end_date=$("#end_date").val();
    var start_date= $("#start_date").val();
    if(start_date ===""){
        start_date="1960-01-01";
        
    }
    if(end_date === ""){
        var d = new Date();
        end_date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
        
    }
    //var date = $("#month_filter").val()
    
       
    
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
        
        

        apply_date_filter(start_date, end_date, acc);
        
            return;
        }
        mem_prev=member_id;
        
        transaction_data_fetch = false;
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
                    render_table(response.transactions, start_date, end_date).then(data => { })
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
    $("#transactions_table thead[thead-type=date_filter]").hide()
    $("#transactions_table ").append(`<tbody name=no_data>
    <tr id="no_data"  style="display:none;" >
                        <td colspan="8" >No Data Available</td>
                    </tr>
                    </tbody>`)
    transaction_data_fetch = true;
    if (data.length == 0) {
        $("#no_data").show();
        if(transaction_data_fetch && acc_data_fetch)
            $("#overlay").hide()
        $("#account_nums")
        .empty()                           
        .append(`<option value = default>All Data</option>`)
        // $("#transactions_table thead[thead-type=date_filter]").empty()
        return true;
    }

    accounts = []
    dates=[]
    $(data).each((index, obj) => {
        if ($.inArray(obj.fields.acc_num, accounts)==-1) {
                accounts.push(obj.fields.acc_num)
        }
        var d = new Date(obj.fields.date)
        
        const final_date = d.toLocaleString('default', { month: 'long' })+'-'+d.getFullYear();
        if($.inArray(final_date,dates)==-1){
            dates.push(final_date)
            $("#transactions_table ").append(
                `
                <thead class=thead-light name=${final_date}  thead-type=date_filter>
                <tr>
                <th colspan=8>${final_date}</th>
                </tr>
                </thead>
                <tbody id=${final_date}>
                </tbody>
                `
            )
        }

        $(`#transactions_table #${final_date}`).append(`<tr name="${obj.fields.acc_num}">
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
    dates=[]
    $("#account_nums")
        .empty()                           
        .append(`<option value = default>All Data</option>`)
    
    $(accounts).each((index, obj) => {
        $("#account_nums").append(`<option value = ${obj}>${obj}</option>`)
        
    })
    
    
     
     apply_date_filter(start_date, end_date)
     
    if(transaction_data_fetch && acc_data_fetch)
    $("#overlay").hide()

  
    return true;


    
}

const apply_date_filter = (start_date, end_date, acc_name = 'default')=>{

     var rows = '';
     $("#transactions_table tbody tr").hide()
     $("#transactions_table thead[thead-type=date_filter]").hide()
     
     if(acc_name==='default'){
        rows = $("#transactions_table tbody tr")
     }
     else{
       rows =  $(`#transactions_table tbody tr[name=${acc_name}]`)


     }

     var data_exist = false;
     start_date = new Date(start_date)
        end_date =new Date(end_date)
        dates=[]
            $(rows).each(function(){
        const children = $(this).children()
        if(children.length<3){
            return;
        }
        
        var date = $(children)[2].innerHTML;
        date = new Date(date)
        date.setHours(0,0,0,0)
        
        if(date>=start_date && date<=end_date){
            const row_date = date.toLocaleString('default', { month: 'long' })+'-'+date.getFullYear();
        if($.inArray(row_date,dates)==-1){
            dates.push(row_date)
            $(`#transactions_table thead[name=${row_date}]`).show()

        }
            $(this).show();
            data_exist = true;
        }

     })
     if(!data_exist){
        $("#no_data").show()
     }



}


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