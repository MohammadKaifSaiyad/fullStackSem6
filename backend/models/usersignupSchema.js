const db = require('../config/db');

/* temp data of user  */
const UserSignupSchema = new db.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    hashedPassword: {
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true
    },
    onDate: {
        type: Date,
        default: Date.now
      }
});

const UserSignupModel = db.model("signupuserdata", UserSignupSchema);


module.exports = UserSignupModel;