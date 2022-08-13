const router = require("express").Router();
const passport = require("passport");
const jwt = require('jsonwebtoken')

router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/login/confirm", (req, res, next) => {
	res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', 'https://userben.ch')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
    next()

	const token = jwt.sign({
		exp: Math.floor(Date.now() * 1000),
		user: req.user._json,
		issuer: 'elmas.io'
	}, 'MQDzAAlNsFHaEg4ICA')

	// if (req.user) {
	// 	res.status(200).json({ user: req.user._json, token });
	// } else {
	// 	res.status(403).json();
	// }

	res.json({ user: req.user._json, token });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]), (req, res) => { });

router.get(
	"/google/callback",
	passport.authenticate("google"),
	(req, res) => {
		// res.send(req.user);
		res.status(200).redirect("https://userben.ch");
	}
);

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("https://userben.ch");
});

module.exports = router;
