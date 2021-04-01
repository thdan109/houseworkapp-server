var  mongoose = require('mongoose')

var WashingSchema = new mongoose.Schema({
   "idUser": {type: String},
   "fullname": String,
   "address": String,
   "dateSend": Date,
   "dateTake": Date,
   "timeSend": String,
   "timeTake": String,
   "idStaff": [],
   "staff": [],
   "note": [],
   "status": String,
   "money": String
}) 

var Washing = mongoose.model('Washing', WashingSchema, 'washing')
module.exports = Washing;