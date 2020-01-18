//先設定 svg 方便後面呼叫
const svg = d3.select("svg");

//設定投影法為geoNaturalEarth1
const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);

//設定球形地圖的路徑，並給予 classname = "sphere"
svg
  .append("path")
  .attr("class", "sphere")
  .attr("d", pathGenerator({ type: "Sphere" }));

//讀取地圖 json 資訊，並用 topojson 來讀國家的資料，最後呈現在svg上
d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json").then(data => {
  const countries = topojson.feature(data, data.objects.countries);
  svg
    .selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", pathGenerator);
});
