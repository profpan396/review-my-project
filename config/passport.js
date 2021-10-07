const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require("../models/m.user")
//Require your User Model here!

// configuring Passport!
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
},
  function (accessToken, refreshToken, profile, cb) {
    // a user has logged in via OAuth!
    // refer to the lesson plan from earlier today in order to set this up
    console.log(profile, "<----- Profile"); // <--- Is going to be the users that just logged information from google
    // do we put googleId in single quotes or not?
    User.findOne({ googleId: profile.id }, function (err, userDoc) {
      if (err) return cb(err);

      if (userDoc) {
        return cb(null, userDoc)
      } else {

        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id
        });

        newUser.save(function (err) {
          if (err) return cb(err);
          return cb(null, newUser);
        })

        // The above is equivelant to
        // Student.create(
        //   {
        //     name: profile.displayName,
        //     email: profile.emails[0].value, // THis object should match the keys and values in our schema, be sure to include the
        //     // googleId
        //     googleId: profile.id,
        //   },
        //   function (err, newStudentDoc) {
        //     if (err) return cb(err);
        //     return cb(null, newStudent);
        //   }
        // );
      }
    })
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {

  // Find your User, using your model, and then call done(err, whateverYourUserIsCalled)
  // When you call this done function passport assigns the user document to req.user, which will 
  // be availible in every Single controller function, so you always know the logged in user

});



