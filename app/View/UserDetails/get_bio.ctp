<?php
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$result = array();
$result["data"] = $data;
$result["status"] = $status;
$result["message"] = $message;

echo json_encode($result);
?>