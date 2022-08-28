const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const User = require("./models/user-model");
const GPU = require("./models/PC/gpu-model");
const mongoose = require("mongoose");
const checkJwt = require("./auth");
const jwt = require("jsonwebtoken");
const authRoute = require("./routes/auth");
const SearchRoute = require("./routes/search");
const app = express();
require('dotenv').config()

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["ilikecookies"],
    name: "session",
  }),
  (req,res,next) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', process.env.HOST)
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    next()
  }
);

app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
  mongoose.connect("mongodb+srv://userbench:pezNmSWz6VibcZsH@cluster0.8wgcbsj.mongodb.net/?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,

  });

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log("calisiyor"));

/* Auth */
app.use("/auth", authRoute);
app.use("/", SearchRoute);

// auth with google+
app.get("/google", passport.authenticate("google", ["profile", "email"]));

/* Profile */

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

app.get("/search", /* authCheck, */ /* checkJwt, */(req, res) => {
  const user = req.query.user;
    User.find(
      { name: user },
      (err, data) => {
        data ? res.json(data) : res.json(err)
      }
    );
});

// isim güncelleme
app.get("/update", authCheck, (req, res) => {
  const kullanici = req.query.user;
  const newname = req.query.product;

  User.updateOne({ _id: req.user.id }, { username: newname }, (err, data) => {
    res.json(data);
  });
});


// isim array ekleme
app.get("/add", (req, res) => {
  const names = req.query.product;
  const cates = req.query.category;
  const image = req.query.img;
  const token = jwt.verify(req.query.token, 'MQDzAAlNsFHaEg4ICA')
  // const token = req.query.token;

  console.log(token)

  User.findOneAndUpdate(
    { googleId: token.id },
    {
      $push: {
        product: [{ name: names, category: cates, image: image }]
      }
    },
    (err, data) => {
      res.json(data);
    }
  );
});

app.post("/add", (req, res) => {
  const names = req.body.product;
  const id = req.body.id;


  User.findOneAndUpdate(
    { googleId: req.user.id },
    {
      $push: {
        product: [{ name: names }]
      }
    },
    (err, data) => {
      res.json(data);
      //console.log("hata", err)
    }
  );
  console.log(req.user.id)
  console.log(names)
  console.log(Date())
});

// isim array silme
app.get("/delete", (req, res) => {
  const names = req.query.product;
  const token = jwt.verify(req.query.token, 'MQDzAAlNsFHaEg4ICA')

  User.updateOne(
    { googleId: token.id },
    {
      $pull: { product: { name: names } },
    },
    (err, data) => {
      console.log(data);
      res.json(data);
    }
  );
});