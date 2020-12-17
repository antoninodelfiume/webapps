function getEstrattoConto(){

    var cliente = document.getElementById("cliente-idx").value;
        $.ajax({
            type:"POST",  //Request type
            url: "http://"+php_files+"getEstrattoConto.php",
            data:{cliente:cliente},
            dataType: "json",
            success:function(data) {
                var sumImporti = 0;
                var sumPagato = 0;
               $("#tbody-movimenti").empty().append("");
               if(data.length>0){
                   $.each(data,function (i,item){
                       sumImporti+=parseFloat(item.importo);
                       sumPagato+=parseFloat(item.importo_pagato);
                       var valueToIns = parseFloat(item.importo)-parseFloat(item.importo_pagato);
                       $("#tbody-movimenti").append("<tr><td><input type=\"hidden\" id=\"dataDoc_"+i+"\" value=\""+item.datadoc+"\"><input type=\"hidden\" id=\"importoValido_"+i+"\" value=\""+valueToIns+"\"><input type=\"hidden\" id=\"numdochidden_"+i+"\" value = '"+item.numdoc+"' ><input type=\"checkbox\" onclick=\"calcolaTotale();\" name=\"seldoc\" id=\"seldoc_"+i+"\"></td><td>"+item.datadoc+"</td><td>"+item.numdoc+"</td><td style=\"text-align:right;\">"+accounting.formatMoney(item.importo,"",2,".",",")+"</td><td style=\"text-align:right;\">"+accounting.formatMoney(item.importo_pagato,"",2,".",",")+"</td></tr>");
                   });
                   document.getElementById("importo").value = accounting.formatMoney(sumImporti,"",2,".",",");
                   document.getElementById("importoPagato").value = accounting.formatMoney(sumPagato,"",2,".",",");
                   //alert(sumPagato);
                   //document.getElementById("importoDaPag").value = accounting.formatMoney(parseFloat(sumImporti)-parseFloat(sumPagato),"€",2,".",",");
               }else{
                   showAlert("Nessun estratto conto da mostrare","","Attenzione", "OK" );
               }
            }

        })
}
var numeriDoc = new Array();
var importiDoc = new Array();
var dataDoc = new Array();
function calcolaTotale(){
    var tot = 0;
     $( "input[name='seldoc']" ).each(function( index ) {
	   if(document.getElementsByName("seldoc")[index].checked){
           tot += parseFloat(document.getElementById("importoValido_"+index).value);

       }
	});

    document.getElementById("importoDaPag").value = accounting.formatMoney(parseFloat(tot),"",2,".",",");

}


function selectAllDoc(){
    $( "input[name='seldoc']" ).each(function( index ) {
		if(document.getElementById("seleMain").checked){
		  document.getElementsByName('seldoc')[index].checked = true;
		}else{
          document.getElementsByName('seldoc')[index].checked = false;
        }
	});
  calcolaTotale();
}

function confermaEstrattoConto(){
    $( "input[name='seldoc']" ).each(function( index ) {
	   if(document.getElementsByName("seldoc")[index].checked){
           numeriDoc.push($("#numdochidden_"+index).val());
           importiDoc.push($("#importoValido_"+index).val());
           dataDoc.push($("#dataDoc_"+index).val());
       }
	});
     var cliente = document.getElementById("cliente-idx").value;

     $.ajax({
            type:"POST",  //Request type
            url: "http://"+php_files+"confermaEstrattoConto.php",
            data:{cliente:cliente, numeriDoc: numeriDoc, importiDoc: importiDoc,agente:getCookie("code"),seriedoc:getCookie("seriedoc") },
            dataType: "json",
            success:function(data) {
              var numeriDoc = new Array();
              var importiDoc = new Array();
              showAlert("Estratto conto aggiornato correttamente","","Attenzione", "OK" );
              location.reload();
            }

    });
}
