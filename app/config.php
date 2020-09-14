<?php
	header('Access-Control-Allow-Origin: *');
   $localhost="localhost";
   $username="root";
   $password="MySWT26062014";
   $database="swsalesmobile";
   $dblink = new mysqli($localhost, $username, $password,$database);
	if ($dblink->connect_errno) {
     printf("Failed to connect to database");
     exit();
	}
   
?>