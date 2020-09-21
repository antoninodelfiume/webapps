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
          orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
      }
   );
}

function cercaProdotto(codice){
    var data_inv = getCookie("data_inv");
    $.ajax({
            type:"GET",  //Request type
            url: "http://"+php_files+"cercaProdotti.php",   
            data:{codice:codice,data_inv:data_inv},
            dataType: "json",
            success:function(data) {
              
               if(data.length>0){
                    document.getElementById("codmxl").value = data[0].PR_CODMXL;
                    document.getElementById("product").value = data[0].AL_ALIAS;
                    document.getElementById("descri").value = data[0].PR_DESCRI;
                    document.getElementById("qtainv").value = data[0].IN_QTAINV;
                    document.getElementById("qtacon").value = data[0].PR_CONQTA;
                    document.getElementById("prz").value = data[0].PR_PRZ1;
                    document.getElementById("cstul").value = data[0].PR_COSULT;
                   
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

function sbloccaQtaInv(){
    document.getElementById("qtainv").removeAttribute("readonly");
}

function getProductForAutocomplete(){
     $.ajax({
            type:"GET",  //Request type
            url: "http://"+php_files+"getProdotti.php",   
            dataType: "json",
            success:function(json) {
               if(json.length>0){
                    $('#descrizione').autocomplete({ //popola lista fornitori
                        source: json,
                        select: function( event, ui ) { // funzione eseguita alla selezione di un fornitore
                           cercaProdotto(ui.item.CODE);
                        }
                    });
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
    var qtagg = document.getElementById("qtagg").value;
    var qtamxl = document.getElementById("qtacon").value;
    var data_inv = getCookie("data_inv");
    var codmxl = document.getElementById("codmxl").value;
    var operatore = getCookie("usr_idx");
    qta = qta.trim();
    qtagg = qtagg.trim();
    if(isNaN(qta)){
        showAlert("Inserire un numero valido nel campo \"QUANTITA' INVENTARIO\"","Attenzione","OK");
        return;
    }
    
    if(isNaN(qtagg)){
        showAlert("Inserire un numero valido nel campo \"QUANTITA' DA AGGIUNGERE\"","Attenzione","OK");
        return;
    }
    $.ajax({
            type:"POST",  //Request type
            url: "http://"+php_files+"aggiornaQta.php",   
            data:{product:product, qta:qta, qtagg:qtagg,qtamxl:qtamxl,data_inv:data_inv,codmxl:codmxl,operatore:operatore},
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
    
    

