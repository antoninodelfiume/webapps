<?php
header('Access-Control-Allow-Origin: *');
	require('config.php');
	require('configrp.php');
    
	 $sql = "select DISTINCT   convert(a.CKY_ART using utf8) as ART_CODE,
                                    convert(CDS_ART using utf8) as value, 
                                    convert(IFNULL(NPZ_LIS, 0.00) using utf8) as ART_PRZ, 
                                    convert(a.CSG_ART_ALT using utf8) as ART_BARCODE,
                                    convert(NGB_IVA using utf8) as ART_IVA, 
                                    convert('0' using utf8) as ART_GIACENZA,
                                    convert(CSG_UNIMIS_PRI using utf8) as ART_UM,
                                    convert(a.DTT_CRE using utf8) as ART_DTT_CRE, 
                                    convert(a.DTT_AGG_ANAG using utf8) as ART_DTT_ULT_AGG 
                   from DAK_ARTI a left join DAK_ARTI_LISTINI m on a.CKY_ART = m.CKY_ART 
                   where CSG_CAT_STAT_ART='P' 
                   order by a.CDS_ART";
	$result = $dblink_rp->query($sql);
	$dbdata = array();
    while ( $row = $result->fetch_assoc())  {
		$dbdata[]=$row;
	}
    echo json_encode($dbdata);
?>