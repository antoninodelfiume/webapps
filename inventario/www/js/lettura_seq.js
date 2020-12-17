function aggiornaQuantitaSequenziale(codice){
    var data_inv = getCookie('data_inv');
    var dateFormat = "DD/MM/YYYY";
    
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
                  aggiornaQuantitaSequenziale_(codice);
               }
            },
            error: function (jqXHR, textStatus, errorThrown){
                alert("Si e' verificato un errore: jqXHR: " + jqXHR + " ------ errorThrown: " + errorThrown + "----- textStatus: "+ textStatus);
            }
        })
    
}


function aggiornaQuantitaSequenziale_(codice){
    
    var data_inv = getCookie("data_inv");
    var operatore = getCookie("usr_idx");
    $.ajax({
            type:"POST",  //Request type
            url: "http://"+php_files+"aggQtaSequenz.php",   
            data:{codice:codice,data_inv:data_inv, operatore:operatore,azienda:getCookie("azienda")},
            dataType: "text",
            success:function(data) {
              //alert("Quantita' aggiornata correttamente");
                if(data == "false"){
                      if(confirm("Barcode non trovato in archivio. Vuoi aggiungerlo?")){
                        registraBarcode(codice);
                        //aggiornaQuantitaSequenziale(codice);
                       }
                }else{
                    runScannerSequenziale();
                }
                
            },
                
            
            error: function (jqXHR, textStatus, errorThrown){
                alert("An Error Ocurred" + textStatus + " ------ " + errorThrown + "-----" );
            }
        });
}
function getProductForAutocomplete(){
     $.ajax({
            type:"GET",  //Request type
            url: "http://"+php_files+"getProdotti.php",  
            data:{azienda:getCookie("azienda")},
            dataType: "json",
            success:function(json) {
               if(json.length>0){
                    $('#descrizione').autocomplete({ //popola lista fornitori
                        source: json,
                        select: function( event, ui ) { // funzione eseguita alla selezione di un fornitore
                           cercaProdotto(ui.item.CODE);
                        }
                    });
                    $('#bcProd').autocomplete({ //popola lista fornitori
                        source: json,
                        select: function( event, ui ) { // funzione eseguita alla selezione di un fornitore
                           $("#bcProdHidden").val(ui.item.CODE);
                            
                        }
                    });
               }
            },
            error: function (jqXHR, textStatus, errorThrown){
                alert("An Error Ocurred" + textStatus + " ------ " + errorThrown + "-----" );
            }
        });
}
function registraBarcode(codice){
    document.getElementById("newBarcode").value=codice;
    document.getElementById("bcProd").value="";
    document.getElementById("bcProdHidden").value="";
    $("#registraNuovoBarcode").modal("show");
}
function salvaBarcode(){
    document.getElementById("regBarcBtn").setAttribute("disabled","disabled");
    var barcode = document.getElementById("newBarcode").value;
    var codice = document.getElementById("bcProdHidden").value;
    if(barcode == ""){
        showAlert("Inserisci un barcode valido.","","Attenzione", "OK");
        return;
    }
    if(codice == ""){
        showAlert("Inserisci un codice articolo valido.","","Attenzione", "OK");
        return;
    }
    
     $.ajax({
            type:"POST",  //Request type
            url: "http://"+php_files+"salvaBarcode.php",   
            data:{codice:codice,barcode:barcode,azienda:getCookie("azienda")},
            dataType: "text",
            success:function(data) {
                 document.getElementById("regBarcBtn").removeAttribute("disabled");
                if(data!="true")
                    showAlert(data,"","Attenzione", "OK" );
                else{
                    $("#registraNuovoBarcode").modal("hide");
                    aggiornaQuantitaSequenziale(barcode);
                }
               
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
          window.location="index.html";
      },
      {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: true, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt : "Scannerizza il barcode del prodotto", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          //formats : "CODE_128", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
      }
   );
}