const db = require('../config/db');
const jwt = require('jsonwebtoken');
const Area = require('./areaSchema');

/*  valid user data */
const LoggedinUserSchema = new db.Schema({
    userName: {
        type: String,
        required: true
    },
    googleSginup:{
        type: Boolean,
        default: false
    },
    userEmail: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: false
    },
    signupDate: {
        type: Date,
        default: Date.now
    },
    profileImgUrl:{
        type: String,
        default:null
    },
    areas:{
        type:[{type: db.Schema.Types.ObjectId, ref: 'Area'}]
    }
});

LoggedinUserSchema.methods.generateToken = async function(){
    try{
        return jwt.sign({
            userId: this._id.toString(),
            email: this.userEmail,
        },process.env.JWT_SECRET,{expiresIn: "1d"});
    }catch(error){
        console.log(error);
    }
};

const LoggedinUserModel = db.model("loggedinuserdata", LoggedinUserSchema);
module.exports = LoggedinUserModel;
// module.exports = {LoggedinUserModel, LoggedinUserSchema}; 