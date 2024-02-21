const db = require('../config/db');

const serviceSchema = new db.Schema({
    serviceDate:{
        require: true,
        type: Date
    },
    operationDate:{
        require: true,
        type: Date
    },
    parts:[{
        type:{
            partName:String,
            partConst:Number
        }
    }],
    serviceType:{
        type:String
    },
    providerDetails:{
        type:{
            name:String,
            contact:{
                contactNumber:Number,
                contactEmail:String
            },
            description:String
        }
    }
});

const Service = db.model('Service',serviceSchema);
module.exports = Service;