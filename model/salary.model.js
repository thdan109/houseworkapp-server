var mongoose = require('mongoose')
var SalarySchema = new mongoose.Schema({

   "idStaff" : String,
   "nameStaff": String,
   "department": String,
   "date":Date,
   "absent": Number,
   "work": Number, 
   "salary": Number,
})

var Salary = mongoose.model('Salary', SalarySchema, 'salary')
module.exports = Salary