import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStategy } from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";

const passportUtil = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStategy(
      {
        clientID:process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"],
      },
      (accessToken, refreshToken, profile, callback) => {
        callback(null, profile);
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.fb_clientID,
        clientSecret: process.env.fb_clientSecret,
        callbackURL: "/auth/facebook/callback",
      },
      function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default passportUtil;
