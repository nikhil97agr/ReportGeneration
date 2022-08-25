var mem_prev="";

$(document).ready(() => {
    
   

    $("#account_nums1").on('change', function () {
        const acc = $(this).val()
        $("#account_state thead[thead-type=date_filter]").hide()
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
        const acc = $("#account_nums1").val()
        
        

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
                    render_table(response.account_state, start_date, end_date).then(data => { })
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

    $("#account_state tbody").empty()
    $("#account_state thead[thead-type=date_filter]").hide()
    $("#account_state ").append(`<tbody name=no_data>
    <tr id="no_data"  style="display:none;" >
                        <td colspan="8" >No Data Available</td>
                    </tr>
                    </tbody>`)
                    console.log("data length",data.length)
    if (data.length == 0) {
        $("#no_data").show();
        $("#overlay").hide()
        $("#account_nums1")
        .empty()                           
        .append(`<option value = default>All Data</option>`)
        // $("#transactions_table thead[thead-type=date_filter]").empty()
        return true;
    }

    accounts = []
    dates=[]
    $(data).each((index, obj) => {
        if ($.inArray(obj.fields.account_number, accounts)==-1) {
                accounts.push(obj.fields.account_number)
        }
        var d = new Date(obj.fields.date_of_update)
        
        const final_date = d.toLocaleString('default', { month: 'long' })+'-'+d.getFullYear();
        if($.inArray(final_date,dates)==-1){
            dates.push(final_date)
            $("#account_state ").append(
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

        $(`#account_state #${final_date}`).append(`<tr name="${obj.fields.account_number}">
                        <td>${obj.pk}</td>
                        <td>${obj.fields.account_number}</td>
                        <td>${obj.fields.date_of_update}</td>
                        <td>${obj.fields.balance_ob}</td>
                        <td>${obj.fields.due}</td>
                        <td>${obj.fields.Overdue_OB}</td> 
                        <td>${obj.fields.PenalCharge}</td>
                        <td>${obj.fields.TotalCharge}</td>
                        <td>${obj.fields.TransferIn_CB}</td> 
                        <td>${obj.fields.TransferOut_CB}</td> 
                        <td>${obj.fields.balance_cb}</td>
                        <td>${obj.fields.Overdue_CB}</td>


                    </tr>`)
        

    })
    dates=[]
    $("#account_nums1")
        .empty()                           
        .append(`<option value = default>All Data</option>`)
    
    $(accounts).each((index, obj) => {
        console.log("This called")
        $("#account_nums1").append(`<option value = ${obj}>${obj}</option>`)
        
    })
    
    
     
     apply_date_filter(start_date, end_date)
     

    $("#overlay").hide()

  
    return true;


    
}

const apply_date_filter = (start_date, end_date, acc_name = 'default')=>{

     var rows = '';
     $("#account_state tbody tr").hide()
     $("#account_state thead[thead-type=date_filter]").hide()
     
     if(acc_name==='default'){
        rows = $("#account_state tbody tr")
     }
     else{
       rows =  $(`#account_state tbody tr[name=${acc_name}]`)


     }

     var data_exist = false;
     start_date = new Date(start_date)
        end_date =new Date(end_date)
        console.log(start_date)
        console.log(end_date)
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
            console.log(row_date)
            $(`#account_state thead[name=${row_date}]`).show()
 
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