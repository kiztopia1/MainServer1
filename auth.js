// auth.js

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("./models/User"); // Path to the userModel.js file

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password", // Add this line to specify the password field
    },
    async (email, password, done) => {
      try {
        // Find the user by email in your database
        const user = await UserModel.findOne({ email });
        console.log(user);

        // If the user doesn't exist or the password is incorrect, return false
        if (!user || !user.password == password) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        // If the email and password are correct, return the user
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
