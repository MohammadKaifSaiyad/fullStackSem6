const router = require('express').Router()
const bodyParser = require('body-parser')
const loggedinuser = require('../models/loginedUserSchema');
const usersignup = require('../models/usersignupSchema')
// const nodemailer = require('nodemailer')
const transporter = require('./transporter')
const speakeasy = require('speakeasy');
const axios = require('axios');
const { sign } = require('jsonwebtoken');

/* 1. checking user email in database.
   2. sendign verification code to the email.
*/

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })



const sendMailOnEmail = async (email, code)=>{
    console.log("inside sendMial")
    const mailOpetions = {
        from: 'demoweb809@gmail.com',
        to: email,
        subject: "Verify Your Email",
        html: `<p>Verify your email for login into your account.</p><p>This Code <b>${code}</b>.</p>`
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

router.post('/send-email', async(req, res)=>{
    try{
        console.log('inside send-email');
        const mailOpetions = {
            to: 'demoweb809@gmail.com',
            subject: `Contact Us`,
            html: `<h3>Email: ${req.body.userEmail}</h3><h4>Subject: ${req.body.subject}</h4><p>Message: ${req.body.message}</p>`
        }
        await transporter.sendMail(mailOpetions)
        res.json({
            status: "SUCCESS",
            message: "Error while sending email",
          });
          return res;
                // .then(()=>{
                //     console.log("mail is sended");
                // }).catch(err=>{
                //     console.log("error due to sending mail",err)
                //     res.json({
                //         status: "FAILED",
                //         message: "Error while sending email",
                //       });
                //       return res;
                // });
    }catch(err){
      console.error("error: ", err);
      res.json({
        status: "FAILED",
        message: "Error while sending email",
      });
      return res;
    }
});

  router.post('/forgotpwd', async(req, res)=>{
    try{
        const user = await loggedinuser.findOne({userEmail: req.body.email});
        if(!user){
            res.json({
                status: "FAILED",
                message: "invalid user email!",
            });
            return res;
        }
        const code = await sendCode(req, res);
        const newSginup = new usersignup({
            userName: user.userName, 
            userEmail: user.userEmail,
            hashedPassword: 'N/A',
            code: code,
            onDate: Date.now()
        })
        newSginup.save();
        res.json({
            status: "SUCCESS",
            message: "now verify code!",
          });
          return res;
    }catch(err){
      res.json({
        status: "FAILED",
        message: "Error while resetting password!",
      });
      console.error('Error: ',err);
      return res;
    }
});

router.post('/reset-otp', async(req, res)=>{
    try{
        const signupuser = await usersignup.findOne({userEmail: req.body.email, code: req.body.otp});
        console.log('userEmail and code: ', signupuser)
        if(!signupuser){
            res.json({
                status: "FAILED",
                message: "Wrong OTP!",
            });
            return res;
        }
        res.json({
            status: "SUCCESS",
            message: "otp verified successfully!",
        });
        return res;
    }catch(err){
      res.json({
        status: "FAILED",
        message: "Error while resetting password!",
      });
      console.error('Error: ',err);
      return res;
    }
});

router.post('/reset-pwd', async(req, res)=>{
    try{
        const user = await loggedinuser.findOne({userEmail: req.body.email});
        console.log(user)
        if(!user){
            res.json({
                status: "FAILED",
                message: "No user found!",
            });
            return res;
        }
        const signup = await usersignup.findOne({userEmail: req.body.email})
        console.log(signup)
        if(!signup){
            res.json({
                status: "FAILED",
                message: "No user found!",
            });
            return res;
        }
        await usersignup.findByIdAndDelete(signup._id);
        user.hashedPassword = req.body.password;
        await user.save();
        res.json({
            status: "SUCCESS",
            message: "password reset successfully!",
        });
        return res;
    }catch(err){
      res.json({
        status: "FAILED",
        message: "Error while resetting password!",
      });
      console.error('Error: ',err);
      return res;
    }
});

module.exports  = router