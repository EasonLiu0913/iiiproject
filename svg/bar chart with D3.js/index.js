const svg = d3.select("svg");

//取得 svg 的長寬
const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
  //設定 x,y 的數值來源
  const xValue = d => d.population;
  const yValue = d => d.country;
  //設置圖表內部 margin
  const margin = { top: 60, right: 30, bottom: 77, left: 220 };
  //計算圖表內部寬度
  const innerWidth = width - margin.left - margin.right;
  //計算圖表內部高度
  const innerHeight = height - margin.top - margin.bottom;

  // X 軸使用線性比例尺
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidth]);

  // Y 軸使用序數比例尺
  const yScale = d3
    .scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);

  //依照 margin.left, margin.top 設定，移動顯示位置
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 將數字用 format 轉換成 Million 為濃縮單位
  // 並將預設顯示的 G 單位， 換成 B（for Billion）
  const xAxisTickFormat = number =>
    d3
      .format(".3s")(number)
      .replace("G", "B");

  const xAxis = d3
    .axisBottom(xScale) //線性比例尺
    .tickFormat(xAxisTickFormat) //轉換數字單位
    .tickSize(-innerHeight); //讓 x 軸單位線向上延伸到頂

  g.append("g")
    .call(d3.axisLeft(yScale)) // 序數比例尺
    .selectAll(".domain,.tick line") //選則 Y 軸的所有線條
    .remove(); // 移除 Y 軸所有線條

  //將 X 軸的 g 設定為一個 xAxisG 常數
  //原本 X 軸顯示在最上方，使用 translate 移動到最下方
  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

  //移除X軸的橫線(classname 為 domain)
  xAxisG.selectAll(".domain").remove();

  xAxisG
    .append("text") //新增 X 軸顯示文字
    .attr("class", "axis-label") //設定 class name
    .attr("y", 65) //調整 Y 位置
    .attr("x", innerWidth / 2) //調整 X 位置置中
    .attr("fill", "black") //因為 g 預設 fill:none 所以這裡另外設 fill:black
    .text("Popunation"); // 欲顯示的文字

  //顯示長條圖
  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", d => yScale(yValue(d)))
    .attr("width", d => xScale(xValue(d)))
    .attr("height", yScale.bandwidth());

  //新增上方圖表標題
  g.append("text")
    .attr("class", "title") //加入classname 方便調整css用
    .attr("y", -10) //往上移動調整位置
    .text("Top 10  Most Populous Countries"); //標題文字
};

d3.csv("data.csv").then(data => {
  data.forEach(d => {
    //將 csv 內的人口數依照單位還原
    d.population = d.population * 1000;
  });

  //呈現數據帶入的渲染畫面
  render(data);
});
