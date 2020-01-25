<?php
session_start();

// print_r($_POST);
// exit();

//引用資料庫連線
require_once('./db.inc.php');

$sql = "SELECT `user_comment`.`commentId`,`user_comment`.`productId`,`user_comment`.`userId`,`user_comment`.`userName`,`user_comment`.`rank`,`user_comment`.`commentText`,`user_comment`.`img`,`user_comment`.`created_at`,`user_comment`.`updated_at`,`reply_comment`.`replyText`
FROM `user_comment` LEFT JOIN `reply_comment`
ON `user_comment`.`commentId` = `reply_comment`.`commentId` WHERE productId = ?";
$arrParram = [$_POST['productId']];
$stmt = $pdo->prepare($sql);
$stmt->execute($arrParram);

if( $stmt->rowCount() > 0 ){

        $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // echo "<pre>";
        echo(json_encode($arr)); 
        // echo "</pre>";
        exit();
} else {
    // header("Refresh: 3; url=./readComment.php");
    echo "";
}

?>