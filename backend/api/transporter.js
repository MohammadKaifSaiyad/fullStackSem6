const nodemailer = require('nodemailer')

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

module.exports = transporter;