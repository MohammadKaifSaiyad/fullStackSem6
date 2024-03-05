const db = require('../config/db');

const serviceSchema = new db.Schema({
    serviceDate:{
        require: true,
        type: String
    },
    operationDate:{
        type: String
    },
    parts:[{
        type:{
            partName:String,
            partCost:Number
        }
    }],
    serviceType:{
        type:String
    },
    providerDetails:{
        type:{
            name:String,
            contactNumber:Number,
            contactEmail:String,
            description:String
        }
    },
    completed:Boolean,
    description:String,
    item:{
        type:db.Schema.Types.ObjectId,
    }
});

const Service = db.model('Service',serviceSchema);
module.exports = Service;