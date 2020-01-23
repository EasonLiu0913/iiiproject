const express = require("express");

const PORT = process.env.PORT || 3000;
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use((req, res, next) => {
  // console.log('%O', req);
  next();
});

app.listen(PORT, () => {
  console.log("Server running on port %d", PORT);
});

//沒有指定路徑，也導到 index.html
app.get("/", (req, res) => {
  // res.send("hello");
  res.sendFile("index.html", { root: __dirname });
});

//針對路徑 /index 導到 index.html
app.get("/index", (req, res) => {
  // res.send("hello /index");
  res.sendFile("index.html", { root: __dirname });
});

//針對路徑 /index.html 導到 index.html
app.get("/index.html", (req, res) => {
  //res.send("hello /index.html");
  res.sendFile("index.html", { root: __dirname });
});

//接受前端 post 而來的遊戲數據
app.post("/gamedata", (req, res) => {
  console.log("player1hp=" + req.body.player1.hp);

  console.log("player1攻擊=" + req.body.player1.atk);

  console.log("player1防禦=" + req.body.player1.def);

  console.log("player2hp=" + req.body.player2.hp);

  console.log("player2攻擊=" + req.body.player2.atk);

  console.log("player2防禦=" + req.body.player2.def);

  //計算玩家 1 的數據
  const player1_minus = req.body.player2.atk - req.body.player1.def;

  //計算玩家 1 的血量
  const player1hp =
    req.body.player1.hp - (player1_minus > 0 ? player1_minus : 0);

  //計算玩家 2 的數據
  const player2_minus = req.body.player1.atk - req.body.player2.def;

  //計算玩家 2 的血量
  const player2hp =
    req.body.player2.hp - (player2_minus > 0 ? player2_minus : 0);

  //設定準備回傳的 json，裡面包含兩位玩家的血量資訊
  let json = {
    player1: player1hp,
    player2: player2hp
  };

  //回傳 json 檔
  res.send(json);
});
