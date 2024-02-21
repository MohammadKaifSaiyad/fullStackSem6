const { default: mongoose } = require('mongoose');
const db = require('../config/db');
const item = require('./itemSchema')

const areaSchema = new db.Schema({
    name: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require:false
    },
    items:{
        type: [{type: db.Schema.Types.ObjectId, ref: 'Item'}]
    }
});
const Area = db.model('Area', areaSchema)
module.exports = Area;