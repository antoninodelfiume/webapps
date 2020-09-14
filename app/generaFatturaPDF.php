<?php

header('Access-Control-Allow-Origin: *');
$content="<page>Hello world</page>";
require_once('html2pdf/html2pdf.class.php');
$html2pdf = new HTML2PDF('P','A4','en');
$html2pdf->WriteHTML($content);
$html2pdf->Output("pdfEsempio.pdf","F");
echo "OK";


?>