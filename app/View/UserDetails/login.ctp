<?php
$result = array();
$result["status"] = $status;
$result["message"] = $message;
$result["dataip"]=$dataip;
$result["data"]=$data;


echo json_encode($result);

