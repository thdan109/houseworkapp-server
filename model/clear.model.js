var mongoose = require('mongoose')
var Staff = require('./staff.model')
var clearSchema = new mongoose.Schema({
   "idUser": String,
   "username": String,
   "address": String,
   "date": Date,
   "area": String,
   "numRoom": String,
   "timeWork":String,
   "timeEnd": String,
   "timeStart": String,
   "idStaff": [],
   "nameStaff": [],
   "reqStaff": {type: mongoose.Schema.Types.ObjectId, ref: 'Staff'},
   "status": String,
   "money": String
})
var Clear = mongoose.model('Clear',clearSchema,'clear' )
module.exports = Clear;