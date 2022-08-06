const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const User = require("./models/user-model");
const mongoose = require("mongoose");
const checkJwt = require("./auth");
const jwt = require("jsonwebtoken");
const authRoute = require("./routes/auth");
const cors = require("cors");
const app = express();

// set up session cookies
app.use(
  express.urlencoded({ extended: false }),
  cors(
    {
      allowedHeaders: '*',
      origin: "https://www.userben.ch",
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
      optionsSuccessStatus: 200
    }
  ),
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["ilikecookies"],
    name: "session",
  }),
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', 'https://www.userben.ch')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    next();
  }
);

app.enableCors({
  allowedHeaders: '*',
  origin: '*',
  credentials: true,
});

// app.use(cors(),
//   cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: ["ilikecookies"],
//     name: "session",
//   })
// )

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect("mongodb+srv://userbench:q6wrSrIk19kh97mG@cluster0.it0dg2k.mongodb.net/?retryWrites=true&w=majority", {
  useFindAndModify: false,
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

/* app.get("/profile", authCheck, (req, res) => {
  res.json({ user: req.user });
});
 */
app.get("/search", /* authCheck, */ /* checkJwt, */(req, res) => {
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