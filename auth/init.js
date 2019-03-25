const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Generate Password
const saltRounds = 10;
const myPlaintextPassword = 'my-password';
const salt = bcrypt.genSaltSync(saltRounds);
const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt);

const user = {
    username: 'test-user',
    passwordHash,
    id: 1
};

function findUser (username, callback) {
    if (username === user.username) {
        return callback(null, user)
    }
    return callback(null)
}

passport.serializeUser(function (user, cb) {
    cb(null, user.username)
});

passport.deserializeUser(function (username, cb) {
    findUser(username, cb)
});

function initPassport () {
    passport.use(new LocalStrategy(
        (username, password, done) => {
            findUser(username, (err, user) => {
                if (err) {
                    return done(err)
                }

                // User not found
                if (!user) {
                    console.log('User not found')
                    return done(null, false)
                }

                // Always use hashed passwords and fixed time comparison
                bcrypt.compare(password, user.passwordHash, (err, isValid) => {
                    if (err) {
                        return done(err)
                    }
                    if (!isValid) {
                        return done(null, false)
                    }
                    return done(null, user)
                })
            })
        }
    ));

    passport.use(new FacebookStrategy({
        'clientID'      : '886573355019396',
        'clientSecret'  : '21accbb66f6f6659caf745f56a9e2fcd',
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    }, (req, token, refreshToken, profile, done) => {
        process.nextTick(() => {
            if (!req.user) console.log(profile);
            return done(null, profile);
        });
    }));

    passport.use(new TwitterStrategy({
            consumerKey: 'BvZEbpEeh4YgMjeOsFLubiayr',
            consumerSecret: 'CrYv0YldTCOY38bxoUMTu1f1WTC1VykXuuPjX7bSawYREA5ChI',
            callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
        },
        function(token, tokenSecret, profile, cb) {
            User.findOrCreate({ twitterId: 8481655 }, function (err, user) {
                return cb(err, user);
            });
        }
    ));

    passport.use(new GoogleStrategy({
            clientID: '661747917614-capj744oddi8urb6vdbm90chv6ln5889.apps.googleusercontent.com',
            clientSecret: 'JLeKnjcY5epLjqG1KTPnQBS5',
            callbackURL: 'http://127.0.0.1:3000/auth/google/callback'
        },
        (token, refreshToken, profile, done) => {
            return done(null, {
                profile: profile,
                token: token
            });
        }));
}

module.exports = initPassport;