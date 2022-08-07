const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const User = require("./models/user-model");
const mongoose = require("mongoose");
//const checkJwt = require("./auth");
//const jwt = require("jsonwebtoken");
const authRoute = require("./routes/auth");
const cors = require("cors");
const app = express();

// const { v4 } = require('uuid');

// app.get('/', (req, res) => {
//   const path = `/item/${v4()}`;
//   res.setHeader('Content-Type', 'text/html');
//   res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
//   res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
// });

// app.get('/item/:slug', (req, res) => {
//   const { slug } = req.params;
//   res.end(`Item: ${slug}`);
// });

// set up session cookies
app.use(
  cors(
    {
      allowedHeaders: '*',
      origin: "https://userben.ch",
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
      preflightContinue: false,
    }
  ),
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["ilikecookies"],
    name: "session",
  }),
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect("mongodb+srv://userbench:Pq46Ylb65IWMfoEW@cluster0.0ugvfk5.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log("calisiyor"));

/* Auth */
app.use("/auth", authRoute);

// auth with google+
app.get("/google", passport.authenticate("google", ["profile", "email"]));

/* Profile */

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.header("Access-Control-Allow-Origin", "*")
    res.redirect("/auth/login");
  } else {
    next();
  }
};

app.get("/search", async (req, res) => {
  const user = req.query.user;

  User.find(
    { name: user },
    (err, data) => {
      res.json(data);
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


  User.findOneAndUpdate(
    { googleId: req.user.id },
    {
      $push: {
        product: [{ name: names, category: cates, image: image }]
      }
    },
    (err, data) => {
      res.json(data);
      // console.log("hata", err)
    }
  );
  console.log(req.user.id)
  console.log(names)
  console.log(Date())
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
app.get("/delete", authCheck, (req, res) => {
  const names = req.query.product;

  User.updateOne(
    { googleId: req.user.id },
    {
      $pull: { product: { name: names } },
    },
    (err, data) => {
      console.log(data);
      res.json(data);
    }
  );
});