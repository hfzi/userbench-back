const express = require("express");
// const cookieSession = require("cookie-session");
// const passport = require("passport");
// const passportSetup = require("./config/passport-setup");
// const User = require("./models/user-model");
const mongoose = require("mongoose");
// const cors = require("cors");
// const checkJwt = require("./auth");
// const jwt = require("jsonwebtoken");
// const authRoute = require("./routes/auth");

const app = express();

app.get("/", (req, res) => {
  res.send("sa")
});

mongoose.connect("mongodb+srv://userbench:q6wrSrIk19kh97mG@cluster0.it0dg2k.mongodb.net/?retryWrites=true&w=majority", {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(process.env.PORT || 4000);