const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user-model");

passport.use(
  new GoogleStrategy(
    {
      // options for google strategy
      clientID:
        "199842155706-5jq4su19pe3fb7oa4jahog0ib891a07t.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },

    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our own db
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have this user
          console.log("user ise: ", profile);
          done(null, profile);
        } else {
          // if not, create user in our db
          new User({
            googleId: profile.user.id,
            username: profile.user.displayName,
            email: profile.user.emails.value,
            thumbnail: profile.user.photos.value,
            date: Date(),
          }).save()
            .then((newUser) => {
              console.log("created new user: ", newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
