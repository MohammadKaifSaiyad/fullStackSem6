const jwt =  require("jsonwebtoken");
module.exports.checkCookies = (req, res, next)=>{
    console.log(req.cookies);
    if(!req.cookies){
        res.json({
            status: 'FAILED',
            message: 'cookies is not present'
        });
        return res;
    }
    if(!req.cookies.jwt){
        res.json({
            status: 'FAILED',
            message: 'awt is not present in cookie'
        });
        return res;
    }
    jwt.verify(req.cookies.jwt, process.env.JWT_SECRET,(err, decode)=>{
        if(err){
            res.json({
                status: 'FAILED',
                message: 'error occure while decoding the jwt token! not a valid user'
            })
            return res;
        }
        if(decode){
            req.body.user_id = decode.userId;
            next();
        }
    })
}