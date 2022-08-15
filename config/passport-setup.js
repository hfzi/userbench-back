const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user-model");

passport.use(
	new GoogleStrategy(
		{
			clientID: '199842155706-5jq4su19pe3fb7oa4jahog0ib891a07t.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		(accessToken, refreshToken, profile, callback) => {

            User.findOne({ googleId: profile._json.sub }).then((currentUser) => {
                if (currentUser) {
                  // already have this user
                  console.log("user isue: ", profile._json);
                  callback(null, currentUser);
                } else {
                  // if not, create user in our db
                  new User({
                    googleId: profile._json.sub,
                    gname: profile._json.name,
                    name: profile._json.name,
                    email: profile._json.email,
                    thumbnail: profile._json.picture,
                    date: Date(),
                  }).save()
                    .then((newUser) => {
                      console.log("created new user: ", newUser);
                      callback(null, newUser);
                    });
                }
              });
              
			callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {done(null, user)})

passport.deserializeUser((user, done) => {done(null, user)})