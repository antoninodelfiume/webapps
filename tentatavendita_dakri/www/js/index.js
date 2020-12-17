/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        console.log(navigator.notification);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }

};

function showAlert(message, callback,title,buttonName){
        navigator.notification.alert(
        message,  // message
        callback,         // callback
        title
        );
    }

/*function checkPreAuth() {

	if(window.localStorage["username"] == undefined || window.localStorage["username"] == "undefined") {
		//$.mobile.navigate( "login.html", { info: "info about the #foo hash" });
        alert(window.localStorage["username"]);
        window.location="login.html";
	}

}*/

function checkPreAuth() {
  var username = getCookie("username");
  if (username == "" || username==undefined) {
    window.location="login.html";
  }
}
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function annullaUltFattura(){
  if(confirm("Sei sicuro di voler eliminare l'ultima fattura? l'operazione potrebbe essere irreversibile")){
   $.ajax({
            type:"POST",  //Request type
            url: "http://"+php_files+"annullaUltFattura.php",
            data:{agente:getCookie("code"),seriedoc:getCookie("seriedoc") },
            dataType: "text",
            success:function(data) {

              showAlert("Fattura annullata correttamente","","Attenzione", "OK" );
            //location.reload();
            }

    });
  }
}
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}



function setAgenteData(){
    document.getElementById("age_name").innerHTML="<b>"+getCookie("nome")+"</b>";
    document.getElementById("age_code").innerHTML="<b>"+getCookie("code")+"</b>";
}
app.initialize();
