<?php
$result = array();
$result["data"] = $data;
$result["status"] = $status;
$result["message"] = $message;

echo json_encode($result);