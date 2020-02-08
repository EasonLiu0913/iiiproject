<?php
session_start();

// print_r($_POST);
// exit();

//引用資料庫連線
require_once('./db.inc.php');

$sql = "SELECT `shopLat`,`shopLong`
FROM `seven_taipei` ";


$stmt = $pdo->prepare($sql);
$stmt->execute();

if( $stmt->rowCount() > 0 ){

        $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // echo "<pre>";
        echo json_encode($arr); 
        // echo "</pre>";
        exit();
} else {
    echo "";
}

?>