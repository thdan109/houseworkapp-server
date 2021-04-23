var mongoose = require('mongoose')
var leaveSchema = new mongoose.Schema({
   "idStaff": String,
   "nameStaff" : String,
   "department": String,
   "date": Date,
   "reason": String
})

var Leave = mongoose.model('Leave', leaveSchema, 'leave')
module.exports = Leave