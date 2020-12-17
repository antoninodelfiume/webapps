function loginSubmit(){
   var username = $("#username").val();
    var password = $("#password").val();
    
    if($.trim(username).length >0 & $.trim(password).length >0) {
        $.ajax({
            type:"POST",  //Request type
            url: "http://"+php_files+"login.php",   
            data:{username:username, password:password},
            cache:false,
            dataType: "json",
            success:function(data) {
               if(data.length>0){
                  
                   setCookie("username",username,10);  
                   setCookie("nome",data[0].USR_USER,10);  
                   setCookie("usr_idx",data[0].USR_IDX,10);
                   setCookie("azienda",data[0].USR_AZ,10);  
                   //setCookie("code",data[0].AGE_CODE,10);  
                   window.location="sel_data.html";    
	
               }else{
                   showAlert("Username e/o password errate","","Attenzione", "OK" );
               }
            },
            error: function (jqXHR, textStatus, errorThrown){
                alert("Si e' verificato un errore: jqXHR: " + jqXHR + " ------ errorThrown: " + errorThrown + "----- textStatus: "+ textStatus);
            }
        })
    } 
    else {
        alert("Input fields are empty");
    }
    
    
}


function checkData(){
    var data_inv = document.getElementById("data_inventario").value;
    var dateFormat = "DD/MM/YYYY";
    if(moment(data_inv, dateFormat, true).isValid()){
      $.ajax({
            type:"POST",  //Request type
            url: "http://"+php_files+"checkData.php",   
            data:{data_inv:data_inv,azienda:getCookie("azienda")},
            cache:false,
            dataType: "text",
            success:function(data) {
               if(data == "true"){
                  showAlert("La data che hai inserito è stata gia movimentata nel gestionale, seleziona un'altra data per continuare","","Attenzione", "OK" );
                                     
               }else{
                  setCookie("data_inv",data_inv,10);  
                   
                  window.location="index.html";    
               }
            },
            error: function (jqXHR, textStatus, errorThrown){
                alert("Si e' verificato un errore: jqXHR: " + jqXHR + " ------ errorThrown: " + errorThrown + "----- textStatus: "+ textStatus);
            }
        })
    }else{
         showAlert("Inserire una data valida per continuare","","Attenzione", "OK" );
    }
}




function checkLastDate(){
    $.ajax({
            type:"POST",  //Request type
            url: "http://"+php_files+"checkLastDate.php",   
            cache:false,
            data:{azienda:getCookie("azienda")},
            dataType: "text",
            success:function(text) {
              
                  document.getElementById("data_inventario").value=text;
              
            },
            error: function (jqXHR, textStatus, errorThrown){
                alert("Si e' verificato un errore: jqXHR: " + jqXHR + " ------ errorThrown: " + errorThrown + "----- textStatus: "+ textStatus);
            }
        })
}



function logout(){
    
    setCookie("username","",10);  
    setCookie("nome","",10);  
    setCookie("code","",10);  
    setCookie("data_inv","",10);  
    setCookie("azienda","",10);  
    window.location="login.html";
}