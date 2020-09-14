function runScanner(){
     cordova.plugins.barcodeScanner.scan(
      function (result) {
         document.getElementById("barcode").value=result.text;
          cercaProdotto(result.text);
      },
      function (error) {
          alert("Scanning failed: " + error);
      },
      {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: true, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt : "Scannerizza il barcode del prodotto", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "CODE_128", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
      }
   );
}

function cercaProdotto(codice){
    
    $.ajax({
            type:"GET",  //Request type
            url: "http://"+php_files+"cercaProdotti.php",   
            data:{codice:codice},
            cache:false,
            dataType: "json",
            success:function(data) {
               if(data.length>0){
                  
                    document.getElementById("product").value = data[0].PR_CODE;
                    document.getElementById("descri").value = data[0].PR_DESCRI;
                    document.getElementById("qtainv").value = data[0].PR_INVQTA;
                    document.getElementById("qtacon").value = data[0].PR_CONQTA;
                   
                    $("#gestisciQuantita").modal("show");
               }else{
                   showAlert("Barcode non trovato in archivio","","Attenzione", "OK" );
               }
            },
            error: function (jqXHR, textStatus, errorThrown){
                alert("An Error Ocurred" + textStatus + " ------ " + errorThrown + "-----" );
            }
        });
    } 

function aggiornaQuantita(){
    var product = document.getElementById("product").value;
    var qta = document.getElementById("qtainv").value;
    
    $.ajax({
            type:"POST",  //Request type
            url: "http://"+php_files+"aggiornaQta.php",   
            data:{product:product, qta:qta},
            cache:false,
            dataType: "json",
            success:function(data) {
               if(data.length>0){
                  
                   showAlert("Giacenza aggiornata correttamente","Attenzione","OK");
                   location.reload();
               }else{
                   showAlert("Si è verificato un errore durante l'aggiornamento della giacenza del prodotto selezionato","","Attenzione", "OK" );
               }
            },
            error: function (jqXHR, textStatus, errorThrown){
                alert("An Error Ocurred" + textStatus + " ------ " + errorThrown + "-----" );
            }
        });
    } 
    
function checkKey(event){
    if (event.keyCode == 13) {
        cercaProdotto(document.getElementById("barcode").value);
        
    }
}
    
    

