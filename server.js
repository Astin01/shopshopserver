const bcrypt = require("bcrypt");

const someOtherPlaintextPassword = "not_bacon";
const express = require("express");
const path = require("path");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
app.use(express.json());
var cors = require("cors");
app.use(cors());

app.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

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
  const myPlaintextPassword = req.body.pw;
  const saltRounds = 10;
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    db.collection("login").insertOne(
      { id: req.body.id, pw: hash },
      function (err, result) {
        console.log("저장완료");
      }
    );
  });
  res.send("전송완료");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/fail" }),
  function (req, res) {
    res.redirect("/");
    console.log("성공");
  }
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pw",
      session: true,
      passReqToCallback: false,
    },
    function (inputId, inputPw, done) {
      db.collection("login").findOne(
        { id: inputId },
        function (err, logresult) {
          if (err) return done(err);
          if (!logresult)
            return done(null, false, { message: "존재하지않는 아이디입니다" });
          bcrypt.compare(inputPw, logresult.pw, function (err, result) {
            if (result == true) return done(null, logresult);
            else return done(null, false, { message: "비번이 틀렸습니다" });
          });
          // if (inputPw == result.pw) {
          //   return done(null, result);
          // } else {
          //   return done(null, false, { message: "비번이 틀렸습니다" });
          // }
        }
      );

      //console.log(inputId, inputPw);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  done(null, {});
});

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "/react-project/build/index.html"));
// });
