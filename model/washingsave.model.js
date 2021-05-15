var moongose = require('mongoose')
var washingsaveSchema = new moongose.Schema({
   "idWork":String,
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
   "money": Number
})
var WashingSave = moongose.model('WashingSave', washingsaveSchema, 'washingsave')
module.exports = WashingSave