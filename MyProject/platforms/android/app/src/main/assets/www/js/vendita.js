
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
        var prz = accounting.formatMoney($("#prz").val().trim(), "€", 2, ".", ","); // €4.999,99
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
    $("#importoTotale").val(accounting.formatMoney(importoTotale, "€", 2, ".", ",")); // €4.999,99)
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
    
    document.getElementById("importoTotale").value=accounting.formatMoney(sum, "€", 2, ".", ",");
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
    $.ajax({
    type:"POST",  //Request type
    url: "http://"+php_files+"generaVendita.php",  
    data:{rowProductArray:JSON.stringify(rowProductArray), agente:getCookie("code"),cli:document.getElementById("cliente-idx").value,impTotale:document.getElementById("importoTotaleHidden").value,impPagato: document.getElementById("importoPagato").value},
    dataType: "text",
    success:function(data) {
      alert("Ordine n.1 memorizzato correttamente");
        
        
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
        $.each(rowProductArray,function (i,item){
            dati_articolo = getAutocompleteValueByKeyProduct(productList, item.product);
            content+="<tr><td style=\"border-left: 1px solid black;\">"+item.product+"<td>"+dati_articolo.value+"</td></td><td style=\"border-left: 1px solid black;\">"+dati_articolo.ART_UM+"</td><td style=\"text-align:right\">"+item.qta+"</td><td style=\"border-top:0px;border-bottom:0px;text-align:right\" class=\"borders_table\">"+accounting.formatMoney(item.price, "", 3, ".", ",")+"</td>"
                +"<td class=\"borders_table\" style=\"text-align:right;border-bottom:0px;border-top:0px;\">"+accounting.formatMoney(Math.round((item.price*item.qta)*1000)/1000, "", 3, ".", ",")+"</td><td></td><td class=\"borders_table\" style=\"text-align:right;border-top:0px;border-bottom:0px;\">"+dati_articolo.ART_IVA+"</td></tr>";
            count_rows++;
        });
        
        if(count_rows<300){
            for(i=0;i<300-count_rows;i++){
                 content+="<tr><td style=\"border-left: 1px solid black;\"><td></td></td><td style=\"border-left: 1px solid black;\"></td><td style=\"text-align:right\"></td><td style=\"border-top:0px;border-bottom:0px;text-align:right\" class=\"borders_table\"></td>"
                +"<td class=\"borders_table\" style=\"text-align:right;border-bottom:0px;border-top:0px;\"></td><td></td><td class=\"borders_table\" style=\"text-align:right;border-top:0px;border-bottom:0px;\"></td></tr>";
            }
        }
        content+="<tr><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td><td class=\"border-bottom\"></td></tr>";
        content+="</tbody></table>";
     
        
        content+="<table style=\" border: 1px solid;width:70%;float:left;margin-top:0px !important;height:150px; font-size:7pt;\"><tr><td width=\"20%\"></td><td>Esenzione Iva</td><td width=\"15%\"></td><td>Aliq.Iva</td><td>Imposta</td><td>Imponibile</td></tr>"+
        "<tr><td></td><td>Operazione esclusa 15)633/72</td><td></td><td>22</td><td>9,02</td><td>40,98</td></tr>"+
        "<tr><td>Pagamento</td><td></td><td></td><td>Scadenze</td><td>Importo</td></tr>"+
        "<tr><td>RIMESSA DIRETTA</td><td></td><td></td><td>06/12/2019</td><td>50,00</td></tr>"+
        "</table>"+
        "<table style=\" border: 1px solid;width:30%;float:right;margin-top:0px !important;height:150px; font-size:7pt;\"><tr><td>Totale Merce</td><td>40,98</td></tr>"+
        "<tr><td>Totale Imponibile</td><td>40,98</td></tr>"+
        "<tr><td>Totale Iva</td><td>9,02</td></tr>"+
        "<tr><td>Totale Fattura</td><td>50,00</td></tr>"+ 
        "<tr><td>Totale da Pagare</td><td>50,00</td></tr>"+  
        "</table>";
        pdf.fromData(content,{type:'share'});
        
      
    },
    error: function (jqXHR, textStatus, errorThrown){
        alert("An Error Ocurred" + textStatus + " ------ " + errorThrown + "-----" );
    }
    });

}


function showAddProdModal(){
    $("#product").val("");
    $("#qta").val("");
    $("#prz").val("");
    $("#inserisciArticolo").modal("show");
}