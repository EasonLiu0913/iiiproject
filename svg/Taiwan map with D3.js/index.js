//抓取瀏覽器內部寬高
const width = window.innerWidth,
  height = window.innerHeight;

//取得瀏覽器寬高，並更改 svg 寬高
function getHeight() {
  document.querySelector("svg").style.height = window.innerHeight + 2;
  document.querySelector("svg").style.width = window.innerWidth + 2;
}

//更改 svg 寬高
getHeight();

//設定 windows 監聽器，更改瀏覽器尺寸時自動更改 svg 寬高
window.addEventListener(
  "resize",
  e => {
    this.getHeight();
  },
  false
);

//先設定 svg 方便後面呼叫,並設定寬高與瀏覽器內容相同
const svg = d3
  .select("svg")
  .attr("width", width)
  .attr("height", height);

//依照不同的瀏覽器寬度做地圖的 rwd 調整
//用 Chrome 模擬，這裡僅是概略抓個顯示比例
let mercatorScale, wDenominator, hDenominator;
w = window.screen.width;
if (w > 1366) {
  mercatorScale = 11000;
  wDenominator = 3.2;
  hDenominator = 2.2;
} else if (w <= 1366 && w > 480) {
  mercatorScale = 20000;
  wDenominator = 1.3;
  hDenominator = 2.5;
} else {
  mercatorScale = 20000;
  wDenominator = 0.7;
  hDenominator = 3;
}

//設定投影方式
const projection = d3
  .geoMercator() // 設定投影法為 geoMercator
  .center([121, 24]) // 並設定地圖中心點 [121, 24]
  .scale(mercatorScale) // 依照 mercatorScale 比例做 scale
  .translate([w / wDenominator, height / hDenominator]); // 依照不同長寬移動地圖顯示位置
const pathGenerator = d3.geoPath().projection(projection);

//設定地圖的路徑，並給予 classname = "sphere"
svg
  .append("path")
  .attr("class", "sphere")
  .attr("d", pathGenerator({ type: "Sphere" }));

//讀取台灣地圖 topojson 檔的資訊，並用 topojson 來轉成 GeoJson 資料，最後呈現在svg上
//地圖原始來源：https://data.gov.tw/dataset/100214
//我使用 https://mapshaper.org/ 轉成 topojson 放入專案之中
d3.json("TOWN_MOI_1080617.json").then(data => {
  const countries = topojson.feature(data, data.objects.TOWN_MOI_1080617);

  let countyTitle = document.querySelector("#titleCounty");
  let townTitle = document.querySelector("#titleTown");

  svg
    .selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", pathGenerator)

    //滑鼠滑過時改變縣市鄉鎮名顯示
    .on("mouseover", function(d) {
      countyTitle.innerHTML = d.properties.COUNTYNAME;
      townTitle.innerHTML = d.properties.TOWNNAME;
    })

    //點擊時改變縣市鄉鎮名顯示
    .on("click", function(d) {
      countyTitle.innerHTML = d.properties.COUNTYNAME;
      townTitle.innerHTML = d.properties.TOWNNAME;
    });
});
