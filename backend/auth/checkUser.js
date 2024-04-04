const jwt =  require("jsonwebtoken");

module.exports.checkUser = (req, res, next)=>{
    if(!req.cookies){
        next();
    }
    if(!req.cookies.jwt){
        next();
    }
    jwt.verify(req.cookies.jwt, process.env.JWT_SECRET,(err, decode)=>{
        if(err){
            next();
        }
        if(decode){
            req.body.user_id = decode.userId;
            res.redirect(`https://inventoflow.vercel.app/user/item/${req.params.item_id}`);
        }
    })
}