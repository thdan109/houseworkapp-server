var mongoose = require('mongoose')
var ReportStaffSchema = new mongoose.Schema({
   "idStaff": String,
   "idUser": String,
   "idWork": String,
   "nameStaff": String,
   // "type": String,
   "rating": Number,
   "note": String
})

var ReportStaff = mongoose.model('ReportStaff', ReportStaffSchema, 'reportstaff')
module.exports = ReportStaff