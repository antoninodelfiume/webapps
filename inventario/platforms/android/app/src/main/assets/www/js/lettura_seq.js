function aggiornaQuantitaSequenziale(codice){
    
    var data_inv = getCookie("data_inv");
    var operatore = getCookie("usr_idx");
    $.ajax({
            type:"POST",  //Request type
            url: "http://"+php_files+"aggQtaSequenz.php",   
            data:{codice:codice,data_inv:data_inv, operatore:operatore},
            dataType: "text",
            success:function(data) {
              //alert("Quantita' aggiornata correttamente");
                if(data == "false"){
                    showAlert("Prodotto non trovato in archivio","Attenzione","OK");
                }
                runScannerSequenziale();
            },
            error: function (jqXHR, textStatus, errorThrown){
                alert("An Error Ocurred" + textStatus + " ------ " + errorThrown + "-----" );
            }
        });
}

function runScannerSequenziale(){
     cordova.plugins.barcodeScanner.scan(
      function (result) {
          if(result.cancelled == true){
              window.location="index.html";
          }else{
              if(result.text != "")
                  aggiornaQuantitaSequenziale(result.text);
          }
      },
      function (error) {
          alert("Scanning failed: " + error);
          window.location=index.html;
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
          orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
      }
   );
}