const LoggedinUserModel = require("../models/loginedUserSchema");
module.exports.checkIsAdmin = async(req, res, next)=>{
    try{
        const admin = await LoggedinUserModel.findById(req.body.user_id);
        if(admin.isAdmin==="true"){
            // const users = await LoggedinUserModel.find({}).populate('area').populate('servicePending').populate('servicesHistory');
            
            next();
        }
    }catch(err){
        console.err('Error: ', err);
        res.json({
            status: 'FAILED',
            message: 'not an Admin!'
        });
        return res;
    }
}