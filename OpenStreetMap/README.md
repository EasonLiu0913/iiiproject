個人 SideProject
1.全台北 7-11 地圖標示是利用我之前爬蟲取得的 7-11 門市地址，並自動套到 google map 取得 geo 地理座標後，存到本地端資料庫中。
最後再用 ajax 跟自己寫的 PHP 後端取得座標後，依序加入到地圖顯示，這部份用到本地端 php + MySQL，因此沒辦法在 github 直接呈現。

2.口罩地圖採用相同原理製作，從政府提供的藥局資訊取得座標及營業時間資訊，加入並標記在地圖上，額外做的處理是使用紅色標記代表完全沒有口罩，棕色標記代表只剩兒童口罩，綠色標記才是仍有大人口罩。
網頁：
https://easonliu0913.github.io/iiiproject/OpenStreetMap/mask-map/index.html
