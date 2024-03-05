const cron = require('node-cron');
const transporter = require('./transporter')
const serviceModel = require('../models/serviceSchema')
const itemModel = require('../models/itemSchema')
const userModel = require('../models/loginedUserSchema')



const sendMailOnEmail = async (service)=>{
    console.log("serivce", service);
    const item = await itemModel.findById(service.item);
    const user = await userModel.findById(item.user);
    const mailOpetions = {
        from: 'demoweb809@gmail.com',
        to: user.userEmail,
        subject: `Reminder: Upcoming Service for Your ${item.name} in InventoFlow`,
        html: `<p>Dear ${user.userName},</p>
                <br>
                <p>We hope this email finds you well. We wanted to remind you that according to the service records in InventoFlow, your ${item.name} is due for service on ${service.serviceDate}</p>
                <p>To ensure that your ${item.name} continues to operate at its best, we recommend scheduling a service appointment as soon as possible.</p>
                <p>Thank you for choosing InventoFlow. We appreciate your business and look forward to assisting you with your service needs.</p>`
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


const checkDate = (serviceDate)=>{
    const date = new Date(serviceDate);
    const currentDate = new Date();
    console.log(currentDate.getFullYear() ,'===', date.getFullYear(),'  ',date.getMonth(),'===',currentDate.getMonth(),'  ',date.getDate(),'===',(currentDate.getDate() + 10));
    if(currentDate.getFullYear() === date.getFullYear() && date.getMonth() === currentDate.getMonth() && date.getDate() <= (currentDate.getDate() + 10))
    {
        console.log('date: ', date);
        return true;
    }
}

const checkServices = ()=>{
    console.log('checking services which are less the 5 days');
    try{
        const services = serviceModel.find({});
        const alertServices = services.filter(service => {
            // checking less then 7 days logic
            return checkDate(service.serviceDate);
        });
        alertServices.forEach(service=>{
            sendMailOnEmail(service)
        })
        
    }catch(err){
        console.log('error while checking service routine:', err);
    }
}

const alertJob = cron.schedule('* * * * *', async() => {
    console.log('starting alert job');
    checkServices();
  });

module.exports = alertJob