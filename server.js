const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
app.use(express.json());
var cors = require("cors");
app.use(cors());

// app.use(express.static(path.join(__dirname, "react-project/build")));

// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "/react-project/build/index.html"));
// });

MongoClient.connect(process.env.DB_URL, function (err, client) {
  if (err) return console.log(err);
  db = client.db("shop");
  app.listen(process.env.PORT, function () {
    console.log("listening on 8080");
  });
});

app.post("/signin", function (req, res) {
  db.collection("login").insertOne(
    { id: req.body.id, pw: req.body.pw },
    function (err, result) {
      console.log("저장완료");
    }
  );
  res.send("전송완료");
});

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "/react-project/build/index.html"));
// });
