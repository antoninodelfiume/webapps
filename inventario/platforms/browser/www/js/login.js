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
                   //setCookie("code",data[0].AGE_CODE,10);  
                   window.location="index.html";    
	
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


function logout(){
    
    setCookie("username","",10);  
    setCookie("nome","",10);  
    setCookie("code","",10);  
    window.location="login.html";
}