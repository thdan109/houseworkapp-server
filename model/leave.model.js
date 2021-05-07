var mongoose = require('mongoose')
var leaveSchema = new mongoose.Schema({
   "idStaff": {type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
   "nameStaff" : String,
   "department": String,
   "status":String,
   "date": Date,
   "reason": String
})

var Leave = mongoose.model('Leave', leaveSchema, 'leave')
module.exports = Leave