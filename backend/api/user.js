const router = require('express').Router()
const bodyParser = require('body-parser')
// const loggedinuser = require('../models/loginedUserSchema');
const usersignup = require('../models/usersignupSchema')
const nodemailer = require('nodemailer')
const speakeasy = require('speakeasy');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {LoggedinUserModel, LoggedinUserSchema} = require('../models/loginedUserSchema');
const { checkCookies } = require('../auth/checkCookies');

router.post('/login',async(req, res)=>{
    // console.log(req.body);
    await LoggedinUserModel.findOne({userEmail: req.body.email})
        .then((user)=>{
            console.log('backend',user);
            
            
                bcrypt.compare(req.body.password, user.hashedPassword, async(err, isMatch)=>{
                if(!isMatch){
                    res.json({
                        status: 'FAILED',
                        message: 'user not found with given data'
                    })
                    return res;
                }
                else{
                    const token = await user.generateToken();
                    res.cookie("jwt",token)
                    res.status(201).json({
                        status: 'SUCCESS',
                        message: 'token generated successfully',
                        jwt: token,
                    })
                    
                    return res;
                }
                callback(null, isMatch);
            })
        })
})

router.get('/getuserdata',checkCookies,(req, res)=>{
    // res.send("ok")
    jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decode)=>{
        if(err){
            res.json({
                status: 'FAILED',
                message: 'error occure while decoding the jwt token.'
            })
            return res;
        }
        res.json({
            email: decode.email,
        })
    })
    
});

module.exports  = router