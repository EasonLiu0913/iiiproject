<?php
set_time_limit(0); //防止超過 30 或 120 秒最長執行時間問題
require_once('./db.inc.php'); //引用資料庫連線

function doCurl($cityCode,$areaCode,$rows,$page){ 
    //從台灣內政部戶政司公開資訊取得門牌資訊
    $url = 'https://www.ris.gov.tw/info-doorplate/app/doorplate/dateQuery?searchType=date&cityCode='.$cityCode.'&tkt=-1&areaCode='.$areaCode.'&village&neighbor&sDate=001-01-01&eDate=109-02-06&_includeNoDate=on&registerKind=0&floor&lane&alley&number&number1&ext&_search=false&nd=1581002444411&rows='.$rows.'&page='.$page.'&sidx&sord=asc&token';

    //設定 headers
    $headers = [
        'Accept: application/json, text/javascript, */*; q=0.01',
        'Content-Type: application/x-www-form-urlencoded; charset=utf-8',
        'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:28.0) Gecko/20100101 Firefox/28.0',
    ]; 
    
    //透過 curl 取得查詢結果(資料總數)
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $html = curl_exec($ch);
    curl_close($ch);

    return $html;
}

$countyName = array('taipei','newtaipei','taoyuan','hsinchu_County','hsinchu_city','miaoli','taichung','changhua','nantou','yunlin','chiayi_city','chiayi_county','tainan','kaohsiung','pingtung','keelung','yilan','hualien','taitung','lienchiang','kinmen','penghu');
$countyCode = array('63000','65000','68000','10004','10018','10005','66000','10007','10008','10009','10020','10010','67000','64000','10013','10017','10002','10015','10014','09007','09020','10016');
$areaNumLimit = array('12','29','13','13','3','18','29','26','13','20','2','18','37','38','33','7','12','13','16','4','6','6');

//依照 $countyName 長度，判斷應該執行幾次縣市資料查詢
for($countyNumber=0; $countyNumber < count($countyName) ; $countyNumber++){

    //執行縣市內的每一區的查詢，區域數字上限用 $areaNumLimit[$countyNumber] 取得
    for($areaNum = 1; $areaNum <= $areaNumLimit[$countyNumber]; $areaNum++){
        
        //首先為每一區建立一個 table
        $sql = "CREATE TABLE IF NOT EXISTS `". $countyName[$countyNumber] ."_". $areaNum. 
        "` (
            `auto_id` INT(10) NOT NULL AUTO_INCREMENT,
            `address` VARCHAR(50) NOT NULL,
            `date` VARCHAR(20) NOT NULL,
            `type` VARCHAR(10) NOT NULL,
            `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `update_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY ( `auto_id` )
        )";

        $pdo_stmt = $pdo->prepare($sql);
        $pdo_stmt->execute();
        
        //按照規則產生 cityCode, areaCode
        $cityCode = $countyCode[$countyNumber].'000';
        $areaVirable = $areaNum < 10 ? '0':'';
        $areaCode = $countyCode[$countyNumber].$areaVirable.$areaNum .'0';

        //rows設定為 0 ，表示不分頁
        $rows = '0';
        $page = '1';
        
        //計算寫入資料庫數字總和
        $countNum = 0;

        //先呼叫一次資料，取得總共筆數
        $firstCall = json_decode(doCurl($cityCode,$areaCode,$rows,$page), true);
        //顯示縣市名稱
        echo $countyName[$countyNumber].':';
        //顯示資料庫內總共有多少筆地址
        echo $firstCall['records'].'('.$areaNum.')'.'<br>';

        //取得資料頁數 $firstCall['total'] 後, 準備開始寫入資料。
        //p.s. 這迴圈是為了超過一頁以上才做的。設定 rows = 0 時，此迴圈無作用。因為總頁數 ($firstCall['total']) = 1
        for($i=0; $i < $firstCall['total'];$i++){

            //取得此頁的所有地址資料並賦值給 $addressObj
            $addressObj = json_decode(doCurl($cityCode,$areaCode,$rows,$page), true);
            
            //取得總資料筆數 count($addressObj['rows']) , 並開始寫入資料庫
            for($k=0; $k < count($addressObj['rows']); $k++){

                //SQL 敘述
                $sql = "INSERT INTO `". $countyName[$countyNumber] ."_".$areaNum."` (`address`, `date`, `type`) VALUES (?, ?, ?)";

                //繫結用陣列,v1 = 建檔地址, v2 = 建檔日期, v3 = 建檔類型
                $arr = [
                    $addressObj['rows'][$k]['v1'],
                    $addressObj['rows'][$k]['v2'],
                    $addressObj['rows'][$k]['v3']
                ];

                //寫入資料庫
                $pdo_stmt = $pdo->prepare($sql);
                $pdo_stmt->execute($arr);

                if ($pdo_stmt->rowCount() === 1) {
                    //如果成功，則計算總寫入筆數
                    $countNum ++;   
                } else {
                    //如果失敗，則顯示在網頁上，方便後續追蹤
                    echo "失敗:".$k."<br>";
                    echo $addressObj['rows'][$k]['v1'];
                    echo $addressObj['rows'][$k]['v2'];
                    echo $addressObj['rows'][$k]['v3'];
                }
            }
            //換下一頁繼續（如果有的話)
            $page++;
        }
        //最後顯示總共寫入資料庫的數字，方便與資料來源總數比對是否正確。
        echo "總完成筆數：".$countNum."<br>";
    }

}

?>