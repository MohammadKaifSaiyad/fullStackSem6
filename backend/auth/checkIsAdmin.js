const LoggedinUserModel = require("../models/loginedUserSchema");
module.exports.checkIsAdmin = async(req, res, next)=>{
    console.log("admin Id: ", req.body.user_id)
    try{
        const admin = await LoggedinUserModel.findById(req.body.user_id);
        if(admin.isAdmin=="true" || admin.isAdmin ==true){
            // const users = await LoggedinUserModel.find({}).populate('area').populate('servicePending').populate('servicesHistory');
            console.log("to next");
            next();
        }
        res.json({
            status: 'FAILED',
            message: 'not an Admin!'
        });
        return res;
    }catch(err){
        console.err('Error: ', err);
        res.json({
            status: 'FAILED',
            message: 'not an Admin!'
        });
        return res;
    }
}