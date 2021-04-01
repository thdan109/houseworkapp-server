var mongoose = require('mongoose')
var clearSchema = new mongoose.Schema({
   "idUser": String,
   "username": String,
   "address": String,
   "date": Date,
   "area": String,
   "numRoom": String,
   "timeWork":String,
   "timeStart": String,
   "idStaff": [],
   "nameStaff": [],
   "money": String
})
var Clear = mongoose.model('Clear',clearSchema,'clear' )
module.exports = Clear;