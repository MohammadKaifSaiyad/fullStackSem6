require("dotenv").config()
const express = require('express')
const path = require('path')
const session = require('express-session')
const apiRouter = require('./api/usersignup')
const userRouter = require('./api/user')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 4000;

app.use(session({
    secret: 'your-secret-key', // Change this to a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
const checkSession = (req, res, next) => {
    if (req.session && req.session.user) {
        // Session is valid
        next();
    } else {
        // Redirect or respond with an error
        res.status(401).send('Unauthorized');
    }
};
app.use(cookieParser())
app.use(urlencodedParser)
app.use(jsonParser)
app.use(session({secret: 'cats'}))
app.use(express.urlencoded())
app.use('/', express.static(path.join(__dirname, 'build')));
app.use('/api/user',userRouter)
app.use('/api', apiRouter);




app.get('*',(req, res)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port, ()=>{
    console.log(`server is running on port: http://localhost:${port}`);
})