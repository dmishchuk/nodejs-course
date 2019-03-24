const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

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
}

passport.use(new FacebookStrategy({
    'clientID'      : '886573355019396',
    'clientSecret'  : '21accbb66f6f6659caf745f56a9e2fcd',
    'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
}, (req, token, refreshToken, profile, done) => {
    process.nextTick(() => {
        if (!req.user) console.log(profile);
        return done(null, profile);
    });
}));

module.exports = initPassport;