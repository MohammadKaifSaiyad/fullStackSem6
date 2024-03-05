const db = require('../config/db');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const Service = require('./serviceSchema')

//name, installation, area,user, maintenance as model

const ItemSchema = new db.Schema({
    name:{
        type: String,
        require: true
    },
    installationDate:{
        type: String,
        require: true,
    },
    count:{
        type: Number,
        require:false
    },
    imageUrl:{
        type: String,
        default:null
    },
    area:{
        type: db.Schema.Types.ObjectId
    },
    user:{
        type:db.Schema.Types.ObjectId
    },
    serialNumber:{
        type:String,
        default:null
    },
    qrCode:{
        type:String
    },
    servicesHistory:{
        type:[{type: db.Schema.Types.ObjectId, ref:'Service'}]
    },
    servicePending:{
        type:[{type: db.Schema.Types.ObjectId, ref:'Service'}]
    }
})
ItemSchema.methods.generateQRCode = async function(){
    const id = this._id.toString();
    console.log("inside generate code",)
    try{
        const qrCodeId = uuidv4();
        console.log(qrCodeId);
        const uniqueQRCodeData = `${id}_${qrCodeId}`;
        console.log(uniqueQRCodeData);
        const qrCodeBuffer = await QRCode.toBuffer(uniqueQRCodeData);
        this.qrCode = uniqueQRCodeData;
        console.log('this.qrCode',this.qrCode)
        return true;
    }catch(err){
        return new Error('error while generating QR code!')
    }
}
const Item = db.model('Item', ItemSchema);

module.exports = Item;