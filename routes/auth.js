const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const checkJwt = require("./auth");
const User = require("../models/user-model");

router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/login/confirm", (req, res) => {
	const info = jwt.verify(req.query.token, 'MQDzAAlNsFHaEg4ICA')

	User.findOne({ googleId: info.id }).then((data) => res.json(data))

});

router.get(
	"/google",
	passport.authenticate("google", ["profile", "email"]),
	(req, res) => { }
);

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
	// res.send(req.user);
	res.status(200).redirect(process.env.HOST);
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(process.env.HOST);
});

router.get("/register", (req, res) => {
	const decodedToken = jwt.decode(req.query.userdata)
	console.log("veri", decodedToken)
	const token = jwt.sign({
		exp: Math.floor(Date.now() * 1000),
		id: decodedToken.sub,
		issuer: "www.elmas.io",
	}, "MQDzAAlNsFHaEg4ICA");

	res.json({ decodedToken, token })
});

module.exports = router;
