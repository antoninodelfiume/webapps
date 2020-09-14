<?php
	header('Access-Control-Allow-Origin: *');
	require('config.php');
	//require('configrp.php');
    $cliente = $_POST["cli"];
	$agente = $_POST["agente"];
	$productRow = json_decode($_POST["rowProductArray"]);
	$impTotale = $_POST["impTotale"];
	$impPagato = $_POST["impPagato"];
	
	if($impPagato>0)
		$pagato = 1;
	
	
	$sql = "select * from agenti where AGE_CODE='".$agente."'";
	$result = $dblink->query($sql);
	$dati_agente = array();
    while ( $row = $result->fetch_assoc())  {
		$dati_agente[]=$row;
	}
   
   $sql = "select max(MOV_NUM_DOC) as numdoc from movimenti ";
   $result = $dblink->query($sql);
   $maxNumdoc = array();
   while ( $row = $result->fetch_assoc())  {
		$maxNumdoc[]=$row;
   }
	 $numdoc = $maxNumdoc[0]['numdoc']+1;
	
	$srdoc = $dati_agente[0]["AGE_SERIE"];
	$codmag = $dati_agente[0]["AGE_MAGAZ"];
	$coddesti = 60; //capire cosa sia;   
	
	 $productLength = count($productRow);
	 for($i=0;$i<$productLength;$i++){
		 $data = date("Y/m/d H:i:s");
        $sql = "insert into movimenti

(MOV_DATA, MOV_TIP_DOC, MOV_NUM_DOC, MOV_SR_DOC, MOV_NUM_RIGA, MOV_COD_AGE, MOV_COD_MAG, MOV_COD_CLI, MOV_COD_DESTI, MOV_COD_ARTI, MOV_QTA, MOV_PRZ, MOV_PAGATO, MOV_TRASFERITO, MOV_TOTALE, MOV_TOTALE_PAG, MOV_NUM_RIGHE_DOC, MOV_TIP_DOC_REF_IC, MOV_NUM_DOC_REF_IC, MOV_DAT_DOC_REF_IC, MOV_MAC_ADD) 
		values(
            '".$data."', 
            'FT', 
            ".$numdoc.", 
            '".$srdoc."', 
			".($i+1).", 
            '".$agente."', 
            '".$codmag."', 
            '".$codcli."', 
            '".$coddesti."', 
            '".$productRow[$i]->product."', 
            ".$productRow[$i]->qta.", 
            ".$productRow[$i]->price.", 
            ".$pagato.", 
            1, 
            ".$impTotale.",
            ".$impPagato.", 
            ".$productLength.",
            '',
            '0',
            '',
			'0')";
        //$result = $dblink->query($sql);
		
       // return $result;
	 	if ($dblink->query($sql) == FALSE) {
			$numdoc = 0;
		} else {
			echo "Error: " . $sql . "<br>" . $dblink->error;
		} 
	}   
/* 	 $sql = "select DISTINCT   convert(a.CKY_ART using utf8) as ART_CODE,
                                    convert(CDS_ART using utf8) as ART_DESCRI, 
                                    convert(IFNULL(NPZ_LIS, 0.00) using utf8) as ART_PRZ, 
                                    convert(a.CSG_ART_ALT using utf8) as ART_BARCODE,
                                    convert(NGB_IVA using utf8) as ART_IVA, 
                                    convert('0' using utf8) as ART_GIACENZA,
                                    convert(CSG_UNIMIS_PRI using utf8) as ART_UM,
                                    convert(a.DTT_CRE using utf8) as ART_DTT_CRE, 
                                    convert(a.DTT_AGG_ANAG using utf8) as ART_DTT_ULT_AGG 
                   from dak_arti a left join dak_arti_listini m on a.CKY_ART = m.CKY_ART 
                   where CSG_CAT_STAT_ART='P'
                   order by a.CDS_ART";
	$result = $dblink_rp->query($sql);
	$dbdata = array();
    while ( $row = $result->fetch_assoc())  {
		$dbdata[]=$row;
	}
    echo json_encode($dbdata); */
	
	//echo $numdoc;
	echo $numdoc;
	
?>