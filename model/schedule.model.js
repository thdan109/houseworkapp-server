var mongoose = require('mongoose')

var ScheduleSchema = new mongoose.Schema({
   "idStaff": String,
   "nameStaff": String, 
})

var Schedule = mongoose.model('Schedule', ScheduleSchema, 'schedule')
module.exports = Schedule