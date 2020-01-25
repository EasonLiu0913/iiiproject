<?php
session_start();

// print_r($_POST);
// exit();

//引用資料庫連線
require_once('./db.inc.php');

$sql = "SELECT * FROM `reply_comment` WHERE `commentId` = ?";
$arrParram = [$_POST['commentId']];
$stmt = $pdo->prepare($sql);
$stmt->execute($arrParram);
$arr = $stmt->fetchAll(PDO::FETCH_ASSOC);
// print_r($arr);
// exit();
if( $stmt->rowCount() > 0 ){
    //因為已經有留言，所以用修改資料的方式
//     print_r($_POST);
// exit();
    $sql = 'UPDATE `reply_comment` SET `replyText` = ? WHERE commentId = ?';
    $arrParram = [$_POST['replyText'],$_POST['commentId']];
    
    $stmt = $pdo->prepare($sql);
    
    $stmt->execute($arrParram);

    if( $stmt->rowCount() > 0 ){
            $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // echo "<pre>";
            // echo(json_encode($arr)); 
            // echo "</pre>";
            echo "修改成功";
            header("Refresh: 1; url=./profile.html?id=".$_POST["prodoctId"]);
            // exit();
    } else {
        // header("Refresh: 3; url=./readComment.php");
        echo "";
    }

}
else{
    //查無此回覆留言，所以新增一筆資料
    $sql = "INSERT INTO `reply_comment` (`commentId`,`replyText`) VALUE (?, ?)";
    $arrParram = [$_POST['commentId'],$_POST['replyText']];
    $stmt = $pdo->prepare($sql);
    $stmt->execute($arrParram);

    if( $stmt->rowCount() > 0 ){

            $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // echo "<pre>";
            // echo(json_encode($arr)); 
            // echo "</pre>";
            echo "回覆成功";
            header("Refresh: 1; url=./profile.html?id=".$_POST["prodoctId"]);
            // exit();
    } else {
        // header("Refresh: 3; url=./readComment.php");
        echo "";
    }
}



?>