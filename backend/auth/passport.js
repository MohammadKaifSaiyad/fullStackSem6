const GoogleStrategy = require("passport-google-oauth20").Strategy
const passport = require("passport")

passport.use(
    new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scope:['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
        prompt: 'consent',
        response_type:'code',
        callbackURL:'http://localhost:5000/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        done(null, profile)
    }
    )
)

passport.serializeUser((user, done)=>{
    done(null, user)
})

passport.deserializeUser((user, done)=>{
    done(null, user)
})

module.exports = passport;