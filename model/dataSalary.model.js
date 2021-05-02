var mongoose = require('mongoose')
var DataSalarySchema = new mongoose.Schema({
   "target": Number,
   "work": Number,
   "bonus": Number,
   "absent": Number,
})

var DataSalary = mongoose.model('DataSalary', DataSalarySchema, 'datasalary')
module.exports = DataSalary