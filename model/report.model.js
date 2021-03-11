var mongoose = require('mongoose');
var ReportSchema = new mongoose.Schema({
   "nameService": String,
   "totalCost": Number,
   "date": Date

})

var Report = mongoose.model('Report', ReportSchema , 'report');
module.exports = Report;