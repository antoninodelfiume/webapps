<?php
header('Access-Control-Allow-Origin: *');
	require('config.php');
	require('configrp.php');
     $agente = $_POST["agente"];
	 $sql = "select DISTINCT   convert(r.CKY_CNT using utf8) as CLI_CODE,
                                    convert(CDS_CNT_RAGSOC using utf8) as value, 
                                    convert(IST_PIVA using utf8) as CLI_PIVA, 
                                    convert(CDS_INDIR using utf8) as CLI_INDIR, 
                                    convert(CDS_CAP using utf8) as CLI_CAP,
                                    convert(CDS_LOC using utf8) as CLI_COMUNE,
                                    convert(CDS_PROV using utf8) as CLI_PROV, 
                                    convert(CSG_CFIS using utf8) as CLI_CODFIS, 
                                    convert(CDS_TEL_TELEX using utf8) as CLI_TEL,
                                    convert(CDS_FAX using utf8) as CLI_FAX,
                                    convert('1' using utf8) as CLI_GIRO,
                                    convert('1' using utf8) as CLI_ZONA,
                                    convert(r.DTT_CRE using utf8) as CLI_DTT_CRE, 
                                    convert(r.DTT_ULT_AGG using utf8) as CLI_DTT_ULT_AGG 
                   from DAK_RUDT r left join DAK_PICO m on r.CKY_CNT=m.CKY_CNT 
                   where m.CKY_CNT_AGENTE='".$agente."' and r.CKY_CNT like '50%'
                   order by r.CDS_CNT_RAGSOC";
	$result = $dblink_rp->query($sql);
	$dbdata = array();
    while ( $row = $result->fetch_assoc())  {
		$dbdata[]=$row;
	}
    echo json_encode($dbdata);
?>