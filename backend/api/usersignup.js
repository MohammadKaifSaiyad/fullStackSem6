const router = require('express').Router()
const bodyParser = require('body-parser')
const loggedinuser = require('../models/loginedUserSchema');
const usersignup = require('../models/usersignupSchema')
const nodemailer = require('nodemailer')
const speakeasy = require('speakeasy');
const axios = require('axios');

/* 1. checking user email in database.
   2. sendign verification code to the email.
*/

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

let transporter = nodemailer.createTransport({
    service: "gmail",
    port:3000,
    auth:{
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
})

transporter.verify((err, success) =>{
    if(err){
        console.log(err)
    } else{
        console.log("Ready to send mail")
    }
})

const sendMailOnEmail = async (email, code)=>{
    console.log("inside sendMial")
    const mailOpetions = {
        from: 'demoweb809@gmail.com',
        to: email,
        subject: "Verify Your Email",
        html: `<p>Verify your email for signup and login into your account.</p><p>This Code <b>${code}</b>.</p>`
    }
    console.log("after mailop")
    await transporter.sendMail(mailOpetions)
            .then(()=>{
                console.log("mail is sended");
            }).catch(err=>{
                console.log("error due to sending mail",err)
            });
    console.log("after mailop....")
};

const sendCode = async(req, res)=>{
    //generating the secret key
    const secret = speakeasy.generateSecret({ length: 20 });

    const code = speakeasy.totp({ 
        // Use the Base32 encoding of the secret key 
        secret: secret.base32, 
        // Tell Speakeasy to use the Base32  
        // encoding format for the secret key 
        encoding: 'base32'
    });
    console.log("code generated")
    await sendMailOnEmail(req.body.email, code);
    console.log("email is sended")
    return code;
};

router.post('/usersignup',async (req , res,next)=>{
    
    console.log("Post request to usersignup");
    console.log(req.body);

    await loggedinuser.find({userEmail: req.body.email})
            .then(async result=>{
                if(result.length){
                    console.log("user exist with this email.");
                    res.json({
                        status: "FAILED",
                        message: "User with this email already exists."
                    })
                } else{

                    // check for entery in signupuser if exist then change otp if not then add otp
                    
                    console.log("no user exist with this email.");
                    await usersignup.findOne({userEmail: req.body.email})
                            .then(async entry=>{
                                if(entry){
                                    const code = await sendCode(req, res);
                                    console.log(code);
                                    entry.code = code;
                                    entry.onDate = Date.now();
                                    await entry.save();
                                    
                                }else {
                                    const code = await sendCode(req, res);
                                    // const code = 122332;
                                    const {username, email, hashpassword} = req.body;
                                    console.log(code);
                                    const signupuserdata = new usersignup({userName: username, 
                                                                            userEmail: email,
                                                                        hashedPassword: hashpassword, code: code,
                                                                        onDate: Date.now()});
                                    await signupuserdata.save();
                                    console.log(username,email, hashpassword);
                                    res.status(200).json({
                                        status: 'SUCCESS',
                                        message: 'data is inserted into temp.'
                                    })

                                    return res;
                                }
                            })
                }
            });
    
    console.log("outside of the");
    return res;
    // console.log("inside....")
})

router.post('/verifyemail',async (req, res, next)=>{
    console.log('inside verifyemail',req.body);

    await usersignup.findOne({userEmail: req.body.email})
    .then(async user=>{
        if(!user){
            res.status(300).json({
                status: 'FAILED',
                message: 'no user with data match in database'
            });
            return res;
        }
        else{
            if(req.body.code == user.code){
                // const validuser = new loggedinuser({
                //     userName: user.userName,
                //     userEmail: user.userEmail,
                //     hashedPassword: user.hashedPassword,
                //     signupDate: Date.now(),
                // });
                // await validuser.save();
                // user.validate = true;
                // await user.save();
                await usersignup.updateOne({userEmail:user.userEmail},{$set:{verified: true}, $currentDate:{lastUpdated: true}})
                    .then(()=>{
                        console.log("data is updated to true")
                    })
                //await usersignup.deleteMany({});
                res.status(200).json({
                    status: 'SUCCESS',
                    message: 'now the user will be crated'
                })
                return res;
                // taking the profile and area name
            }
        }
    })
    .catch(err=>{
        console.log(err);
    })
    return res;
    
})


module.exports  = router