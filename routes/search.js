const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const checkJwt = require("./auth");
const gpu = require("../models/PC/gpu-model");


router.get("/search", (req,res) => {
  // const name = req.query.name
  // const mark = req.query.mark
  // const model = req.query.model
  // const series = req.query.series
  // const country = req.query.country

  // var emptyname = { name: {$regex:name} }
  // var emptymark = { mark: {$regex:mark} }
  // var emptymodel = { model: {$regex:model} };
  // var emptyseries = { series: {$regex:series} };
  // var emptycountry = { country: {$regex:country} };

  // if(!name) emptyname = {};
  // if(!mark) emptymark = {};
  // if(!model) emptymodel = {};
  // if(!series) emptyseries = {};
  // if(!country) emptycountry = {};
  // gpu.find({ $and: [name, Foundry, ProcessSize]}, "name Foundry ProcessSize Transistors", (err, alien) => {
  gpu.find({}, "name image Foundry ProcessSize Transistors MemorySize BoostClock TDP", (err, alien) => {
    //if (err) return handleError(err);
    res.json(alien);
  }).limit(150)
})

module.exports = router;
