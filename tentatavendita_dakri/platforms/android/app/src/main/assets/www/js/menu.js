function ristampaUltFattura(){
  $.ajax({
           type:"POST",  //Request type
           url: "http://"+php_files+"ristampaUltFattura.php",
           data:{agente:getCookie("code"),seriedoc:getCookie("seriedoc") },
           dataType: "text",
           success:function(fileName) {
              
             cordova.plugins.fileOpener2.showOpenWithDialog(
               cordova.file.externalRootDirectory +'/Download/'+fileName+".pdf", // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Downloads/starwars.pdf
               'application/pdf',
               {
                   error : function(e) {
                         showAlert(e.message +". " + fileName,"","","");
                   },
                   success : function () {
                       //showAlert('file opened successfully',"","","");
                   },
                   position : [0, 0]
               }
             );
           }

   });

}
