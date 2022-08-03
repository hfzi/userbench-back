const mongoose = require("mongoose");
const S = mongoose.Schema;

mongoose.connect(
  "mongodb://localhost:27017/Wasd",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to mongodb");
  }
);

const productSchema = new S({
  name: String,
  desc: String,
});

const userSchema = new S({
  username: String,
  googleId: String,
  thumbnail: String,
  product: [String],
});

const veri = mongoose.model("user", userSchema);

function gonder() {
  /*       new veri({
    googleId: "sa",
    username: "as",
    product: [
    {
      name: "kulaklık",
      desc: "Çok iyi bir kulaklık",
    },
    {
      name: "kulaklık",
      desc: "Çok iyi bir kulaklık",
    },
    {
      name: "kulaklık",
      desc: "Çok iyi bir kulaklık",
    },
  ]
  }).save()
  console.log("asd", veri) */

  /*     veri.find({username: "elmas"}, "googleId username product", (err, data) => {
    console.log("asd", data)
  }) */

  veri.update(
    {
      username: "elmas",
    },
    {
      $set: {
        username: "ananas",
      },
    },
    { new: true }
  );

  /* veri.update({googleId: "sa"}, {$set: {googleId: "sas"}}) */
}

gonder();
