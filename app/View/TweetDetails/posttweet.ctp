<?php
$result = array();
$result["status"] = $status;
$result["message"]=$message; 

if($datastatus)
    $result["data"]=$data;
    
echo json_encode($result);

