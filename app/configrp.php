<?php
	header('Access-Control-Allow-Origin: *');
   $localhost="localhost";
   $username="root";
   $password="MySWT26062014";
   $database="dak_rp";
   $dblink_rp= new mysqli($localhost, $username, $password,$database);
	if ($dblink_rp->connect_errno) {
     printf("Failed to connect to database");
	 echo "OK2";
     exit();
	}
   
?>