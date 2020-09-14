<?php
header('Access-Control-Allow-Origin: *');
	require('config.php');

     $username = $_POST["username"];
    $password = $_POST["password"];
	$sql="select * from agenti where AGE_USRNAME='".$username."' and AGE_PASSWD=md5('".$password."')";
	$result = $dblink->query($sql);
	$dbdata = array();
    while ( $row = $result->fetch_assoc())  {
		$dbdata[]=$row;
	}
    echo json_encode($dbdata);
	exit();
?>