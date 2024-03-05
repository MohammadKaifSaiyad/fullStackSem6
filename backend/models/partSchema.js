const { default: mongoose } = require('mongoose');
const db = require('../config/db');

const partSchema = new db.Schema({
    partName:String,
    partCost:Number
});

const Part = db.model('Part',partSchema);
module.exports = Part;