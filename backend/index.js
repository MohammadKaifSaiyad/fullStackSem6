require("dotenv").config()
const express = require('express')
const path = require('path')
const session = require('express-session')
const apiRouter = require('./api/usersignup')
const userRouter = require('./api/user')
const itemRouter = require('./api/items')
const bodyParser = require('body-parser')
const cors = require('cors')
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const cookieParser = require('cookie-parser');
const app = express();
const passport = require('passport')
const authRouter = require('./auth/googlecallback') 
const fileUpload = require('express-fileupload')
const port = process.env.PORT || 4000;
const multer = require('multer');
const alertJob = require('./api/alert')
const viewItemRouter = require('./api/viewItem')

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
alertJob.start();
const corsOptions = {
    origin: 'https://inventoflow.vercel.app/',
    credentials: true
};
app.use(cookieParser())
app.use(urlencodedParser)
app.use(jsonParser)
app.use(session({secret: process.env.SESSION_KEY,resave: false,saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded())
app.use(cors(corsOptions))
const storage = multer.memoryStorage();
const upload = multer({ storage: storage,limits: { fileSize: 5 * 1024 * 1024 } });
app.use(upload.single('image'));
// app.use(fileUpload({
//     useTempFiles:true
// }))




app.use('/', express.static(path.join(__dirname, 'build')));
app.use('/api/user',userRouter)
app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/items',itemRouter)
app.use('/api/view',viewItemRouter)



app.get('*',(req, res)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port, ()=>{
    console.log(`server is running on port: http://localhost:${port}`);
})