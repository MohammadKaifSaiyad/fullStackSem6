const db = require('../config/db');
const jwt = require('jsonwebtoken');

/*  valid user data */
const LoggedinUserSchema = new db.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    signupDate: {
        type: Date,
        default: Date.now
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

module.exports = {LoggedinUserModel, LoggedinUserSchema}; 