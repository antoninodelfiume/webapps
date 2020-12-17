
var client_list;
function getClientAutocomplete(){
        $.ajax({
            type:"POST",  //Request type
            url: "http://"+php_files+"getClienti.php",
            data:{agente:getCookie("code")},
            cache:false,
            dataType: "json",
            success:function(data) {
               if(data.length>0){
                    client_list=data;
                    $('#cliente').autocomplete({ //popola lista fornitori
                        source: data,
                        select: function( event, ui ) { // funzione eseguita alla selezione di un fornitore
                            $('#cliente-idx').val(ui.item.CLI_CODE);
                        }
                     });

               }else{
                   showAlert("Nessun cliente disponibile!","","Attenzione", "OK" );
               }
            },
            error: function (jqXHR, textStatus, errorThrown){
                alert("An Error Ocurred" + textStatus + " ------ " + errorThrown + "-----" );
            }
        });
}


/*function runScanner(){
     cordova.plugins.barcodeScanner.scan(
      function (result) {
         document.getElementById("product").value=result.text;
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
          prompt : "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "CODE_128", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
      }
   );
}*/
var productList;
function getProductAutocomplete(){
        $.ajax({
            type:"POST",  //Request type
            url: "http://"+php_files+"getArticoli.php",
            data:{agente:getCookie("code")},
            cache:false,
            dataType: "json",
            success:function(data) {
               if(data.length>0){
                    productList=data;
                    $('#product').autocomplete({ //popola lista fornitori
                        source: data,
                        select: function( event, ui ) { // funzione eseguita alla selezione di un fornitore
                            $('#product-idx').val(ui.item.ART_CODE);
                        }
                     });

               }else{
                   showAlert("Nessun articolo disponibile!","","Attenzione", "OK" );
               }
            },
            error: function (jqXHR, textStatus, errorThrown){
                alert("An Error Ocurred" + textStatus + " ------ " + errorThrown + "-----" );
            }
        })
}

var index =0;
function aggiungiRigaProdotto(){
    if(!isNaN($("#prz").val())){
        var prz = accounting.formatMoney($("#prz").val().trim(), "", 2, ".", ","); // €4.999,99
    }else{
        showAlert("Inserire un prezzo valido","","Attenzione", "OK" );
        return false;
    }
     if(!isNaN($("#qta").val()) && $("#qta").val().indexOf(".")==-1 && $("#qta").val().indexOf(",") == -1 ){
        var qta = $("#qta").val().trim();
    }else{
        showAlert("Inserire una quantita' valida","","Attenzione", "OK" );
        return false;
    }
    if($("#product").val()!="" && $("#product-idx").val()!=""){
        var product = $("#product").val();
        var product_idx = $("#product-idx").val();
    }
    else{
        showAlert("Inserire un prodotto' valido","","Attenzione", "OK" );
        return false;
    }
    $("#tbody-ordini").append("<tr id=\"tr_"+index+"\"><td><p><b>"+product+"<input type=\"hidden\" name=\"product_code\" value=\""+product_idx+"\">"
                              +"</b></p></td><td align=\"right\"><p><b>"+qta+"<input type=\"hidden\" name=\"product_qta\" value=\""+qta+"\">"
                              +"</b></p></td><td  align=\"right\"><p><b>"+prz+"<input type=\"hidden\" name=\"product_price\" value=\""+$("#prz").val()+"\">"
                              +"</b></p></td><td><span class=\"glyphicon glyphicon-remove\" onclick=\"removeRow("+index+")\"></span></td></tr>" );
    index++;

    var importoTotale = $("#importoTotaleHidden").val();
    if(isNaN(importoTotale) || importoTotale == ""){
        importoTotale=0;
    }
    importoTotale=parseFloat(importoTotale)+parseFloat($("#prz").val())*$("#qta").val();
    $("#importoTotaleHidden").val(importoTotale);
    $("#importoTotale").val(accounting.formatMoney(importoTotale, "", 2, ".", ",")); // €4.999,99)
    $("#inserisciArticolo").modal("hide");
    document.getElementById("showArticoli").setAttribute("style","display:block;");
}

function removeRow(index){
    $("#tr_"+index).remove();
    updateTotal();
    checkTableLength();
}

function checkTableLength(){
    if(document.getElementById("table-orders").rows.length==1){
         document.getElementById("showArticoli").setAttribute("style","display:none;");
    }
}
function updateTotal(){
    var sum=0;
    $("input[name='product_price']").each(function(i,n){
		sum += (document.getElementsByName("product_price")[i].value*document.getElementsByName("product_qta")[i].value);
	});

    document.getElementById("importoTotale").value=accounting.formatMoney(sum, "", 2, ".", ",");
    $("#importoTotaleHidden").val(sum);

}
function resetField(){
    if($("#cliente").val() == ""){
        $("#cliente-idx").val("");
    }

}


function getAutocompleteValueByKeyClient(list,key){
	var x;
	$.grep(list, function( n, i ) {
		if(n.CLI_CODE==key)
			x = n;
	});
	return x;
}
function getAutocompleteValueByKeyProduct(list,key){
	var x;
	$.grep(list, function( n, i ) {
		if(n.ART_CODE==key)
			x = n;
	});
	return x;
}


function generaVendita(){
    document.getElementById("venditaButton").setAttribute("disabled","disabled");
    var alIvaList = new Array();
    var importoTotale = 0;
    var importoPagato = 0;
    var rowProductArray = new Array();
    if(document.getElementById("importoTotaleHidden").value==0 || document.getElementById("importoTotaleHidden").value <0 || document.getElementById("importoTotaleHidden").value==undefined){
         showAlert("Attenzione, provare a ricaricare i prodotti inseriti' valido","","Attenzione", "OK" );
         return false;
    }
    var importoPagato = document.getElementById("importoPagato").value ;
    if(importoPagato=="" || importoPagato <0 || isNaN(importoPagato)){
         showAlert("Attenzione, controllare l'importo pagato. E' stato inserito un valore non valido.","","Attenzione", "OK" );
        return false;
    }
    $("input[name='product_code']").each(function(i,n){
		var productRow ={product: document.getElementsByName("product_code")[i].value,qta:document.getElementsByName("product_qta")[i].value,price:document.getElementsByName("product_price")[i].value};
        rowProductArray.push(productRow);
	});
  var dataDoc;
  var numdoc;
    $.ajax({
    type:"POST",  //Request type
    url: "http://"+php_files+"generaVendita.php",
    data:{rowProductArray:JSON.stringify(rowProductArray), agente:getCookie("code"),cli:document.getElementById("cliente-idx").value,impTotale:document.getElementById("importoTotaleHidden").value,impPagato: document.getElementById("importoPagato").value},
    dataType: "json",
    success:function(json) {

      alert("Ordine n."+json.numdoc+" memorizzato correttamente");

      dataDoc = json.data;
      numdoc = json.numdoc;
      // Our code start here
       /* var opts = {
            type: "share",         //Open a context menu and ask the user what to do next (print, mail, etc..).
            fileName: 'v8-tutorial.pdf' //it will use this filename as a place-holder
        }
        pdf.fromURL("http://"+php_files+"generaFatturaPDF.php", opts)
        .then((status) => console.log('success->', status))
        .catch((error) => console.log(error));*/
        var dati_clienti = getAutocompleteValueByKeyClient(client_list, $("#cliente-idx").val());
        var content = "<style>table{font-size:8pt;margin-top:15px !important;} .border-bottom{border-bottom:1px solid black;} .bordercoll{border-collapse: collapse;} .borders_table{border: 1px solid black;}</style>"+
        "<img src=\""+cordova.file.applicationDirectory + "www/img/dak1.jpg\">"+
        getCookie("seriedoc")+"/"+numdoc+
        "<div style=\"width:100%;display: inline-block;\"><table style=\"border: 1px solid; float:left;width:50%; \">"+
        "<tr><td><b>Destinatario</b><td></tr>"+
        "<tr><td>"+dati_clienti.value+"</td></tr>"+
        "<tr><td>"+dati_clienti.CLI_INDIR+"</td></tr>"+
        "<tr><td>"+dati_clienti.CLI_CAP+" "+dati_clienti.CLI_COMUNE+" "+dati_clienti.CLI_PROV+"</td></tr>"+
        "<tr><td>P.IVA  "+dati_clienti.CLI_PIVA+"</td></tr>"+
        "</table>";


        content+="<table style=\" border: 1px solid; float:right;width:49%; \">"+
        "<tr><td><b>Destinazione</b><td></tr>"+
        "<tr><td>"+dati_clienti.value+"</td></tr>"+
        "<tr><td>"+dati_clienti.CLI_INDIR+"</td></tr>"+
        "<tr><td>"+dati_clienti.CLI_CAP+" "+dati_clienti.CLI_COMUNE+" "+dati_clienti.CLI_PROV+"</td></tr>"+
        "<tr><td>P.IVA  "+dati_clienti.CLI_PIVA+"</td></tr>"+
        "</table></div>";
        var count_rows=0;

        content+="<table style=\"width:100%;\" class=\"bordercoll\">"+
            "<thead><th style=\"border-right:0px !important;\" class=\"borders_table\">ARTICOLO</th><th style=\"border-left:0px !important;\" class=\"borders_table\"></th><th style=\"border-right:0px !important; text-align:left;\" class=\"borders_table\">UM</th><th class=\"borders_table\" style=\"border-left:0px !important;text-align:right\">QUANTITA'</th><th class=\"borders_table\">PREZZO UNITARIO</th><th  class=\"borders_table\">IMPORTO</th><th class=\"borders_table\">SCONTO</th><th class=\"borders_table\">Ali.IVA</th></thead><tbody>";
        var isScontoFound = false;
        var imposta = 0;
        var totaleMerce = 0;
        $.each(rowProductArray,function (i,item){
            dati_articolo = getAutocompleteValueByKeyProduct(productList, item.product);
            var scmerce = "";
            var iva = "";
            if(item.price <= 0){
                scmerce = "SC.MERCE";
                iva = "S15";
                isScontoFound= true;
            }
            else{
                scmerce =  "";
                iva = dati_articolo.ART_IVA;
            }

            var isIvaFound = false;
            for(i=0;i<alIvaList.length;i++){
                if(alIvaList[i] ==iva){
                    isIvaFound = true;
                }
            }
            if(!isIvaFound)
                alIvaList.push(iva);
            if(item.price>0){
                var app = ((item.price*item.qta)*iva)/100;
                imposta = imposta + app;
            }
            totaleMerce += item.price*item.qta;
            content+="<tr><td style=\"border-left: 1px solid black;\">"+item.product+"<td>"+dati_articolo.value+"</td></td><td style=\"border-left: 1px solid black;\">"+dati_articolo.ART_UM+"</td><td style=\"text-align:right\">"+item.qta+"</td><td style=\"border-top:0px;border-bottom:0px;text-align:right\" class=\"borders_table\">"+accounting.formatMoney(item.price, "", 3, ".", ",")+"</td>"
                +"<td class=\"borders_table\" style=\"text-align:right;border-bottom:0px;border-top:0px;\">"+accounting.formatMoney(Math.round((item.price*item.qta)*1000)/1000, "", 3, ".", ",")+"</td><td>"+scmerce+"</td><td class=\"borders_table\" style=\"text-align:right;border-top:0px;border-bottom:0px;\">"+iva+"</td></tr>";
            count_rows++;
        });
        var opeEsclusa = ""
        if(isScontoFound == true){
            opeEsclusa="Operazione esclusa 15) 633/72";
        }else{
            opeEsclusa="";
        }
        if(count_rows<300){
            for(i=0;i<300-count_rows;i++){
                 content+="<tr><td style=\"border-left: 1px solid black;\"><td></td></td><td style=\"border-left: 1px solid black;\"></td><td style=\"text-align:right\"></td><td style=\"border-top:0px;border-bottom:0px;text-align:right\" class=\"borders_table\"></td>"
                +"<td class=\"borders_table\" style=\"text-align:right;border-bottom:0px;border-top:0px;\"></td><td></td><td class=\"borders_table\" style=\"text-align:right;border-top:0px;border-bottom:0px;\"></td></tr>";
            }
        }
        content+="<tr><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td></tr>";
        content+="</tbody></table>";

        var ivaString = "";

        for(i=0;i<alIvaList.length;i++){
           ivaString+=alIvaList[i]+"<br/>";
        }

        content+="<table style=\" border: 1px solid;width:70%;float:left;margin-top:0px !important;height:150px; font-size:7pt;\"><tr><td width=\"20%\"></td><td>Esenzione Iva</td><td width=\"15%\"></td><td>Aliq.Iva</td><td style=\"text-align:right;\">Imposta</td><td style=\"text-align:right;\">Imponibile</td></tr>"+
        "<tr><td></td><td>"+opeEsclusa+"</td><td></td><td>"+ivaString+"</td><td style=\"text-align:right;\">"+accounting.formatMoney(Math.round(imposta*1000)/1000, "", 2, ".", ",")+"</td><td style=\"text-align:right;\">"+accounting.formatMoney(Math.round(totaleMerce*1000)/1000, "", 2, ".", ",")+"</td></tr>"+
        "<tr><td>Pagamento</td><td></td><td></td><td>Scadenze</td><td style=\"text-align:right;\">Importo</td></tr>"+
        "<tr><td>RIMESSA DIRETTA</td><td></td><td></td><td></td><td style=\"text-align:right;\">"+accounting.formatMoney(Math.round((totaleMerce+imposta)*1000)/1000, "", 2, ".", ",")+"</td></tr>"+
        "</table>"+
        "<table style=\" border: 1px solid;width:30%;float:right;margin-top:0px !important;height:150px; font-size:7pt;\"><tr><td style=\"text-align:right;\">Totale Merce</td><td style=\"text-align:right;\">"+accounting.formatMoney(Math.round((totaleMerce)*1000)/1000, "", 2, ".", ",")+"</td></tr>"+
        "<tr><td style=\"text-align:right;\">Totale Imponibile</td><td style=\"text-align:right;\">"+accounting.formatMoney(Math.round((totaleMerce)*1000)/1000, "", 2, ".", ",")+"</td></tr>"+
        "<tr><td style=\"text-align:right;\">Totale Iva</td><td style=\"text-align:right;\">"+accounting.formatMoney(Math.round(imposta*1000)/1000, "", 2, ".", ",")+"</td></tr>"+
        "<tr><td style=\"text-align:right;\">Totale Fattura</td><td style=\"text-align:right;\">"+accounting.formatMoney(Math.round((totaleMerce+imposta)*1000)/1000, "", 2, ".", ",")+"</td></tr>"+
        "<tr><td style=\"text-align:right;\">Totale da Pagare</td><td style=\"text-align:right;\">"+accounting.formatMoney(Math.round((totaleMerce+imposta)*1000)/1000, "", 2, ".", ",")+"</td></tr>"+
        "</table>";
        var options = {
            documentSize: 'A4',
            type: 'base64'
        };
        var fileName = "FT_"+getCookie('seriedoc')+"_"+numdoc+"_"+dataDoc+".pdf";
        document.getElementById("fileName").value=fileName;
      //  pdf.fromData(content,{type:'share'});
      //   pdf.fromData(content,{type:'share'});

      //GENERA IL FILE
      var folderpath = cordova.file.externalRootDirectory + "Download/"; 
      pdf.fromData(content,options).then(function(base64){
      // To define the type of the Blob
            var contentType = "application/pdf";

              // if cordova.file is not available use instead :
                // var folderpath = "file:///storage/emulated/0/Download/";
                  /you can select other folders
                  savebase64AsPDF(folderpath, fileName, base64, contentType);

    });
    setTimeOut(openFile,4000);



    },
    error: function (jqXHR, textStatus, errorThrown){
        alert("An Error Ocurred" + textStatus + " ------ " + errorThrown + "-----" );
    }
    });

}


function openFile(){
  var fileName = document.getElementById("fileName").value;


  cordova.plugins.fileOpener2.showOpenWithDialog(
    cordova.file.externalRootDirectory +'/Download/'+fileName, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Downloads/starwars.pdf
    'application/pdf',
    {
        error : function(e) {
              showAlert(e.message + "!!!" + fileName,"","","");
        },
        success : function () {
        //  isFound = true;
          //  showAlert('file opened successfully',"","","");
        },
        position : [0, 0]
    }
  );

}
/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (application/pdf - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}

/**
 * Create a PDF file according to its database64 content only.
 *
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:application/pdf;base64). Only the base64 string is expected.
 */
function savebase64AsPDF(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content,contentType);

//    console.log("Starting to write the file :3");

    window.resolveLocalFileSystemURL(folderpath, function(dir) {
      //  showAlert('Access to the directory granted succesfully',"","","");
        dir.getFile(filename, {create:true}, function(file) {
           //showAlert('Fattura generata correttamente.',"","","");
            file.createWriter(function(fileWriter) {
              //  console.log("Writing content to file");
              //  showAlert('Writing content to file ',"","","");
                fileWriter.write(DataBlob);
            }, function(){
              //  showAlert('Unable to save file in path ',"","","");
            })
        });
    })
}

function showAddProdModal(){
    $("#product").val("");
    $("#qta").val("");
    $("#prz").val("");
    $("#inserisciArticolo").modal("show");
}
