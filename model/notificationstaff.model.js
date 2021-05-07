var mongoose = require('mongoose')
var NotificationStaffSchema = new  mongoose.Schema({

   "idStaff": {type:  mongoose.Schema.Types.ObjectId, ref: 'Staff'},
   "date": Date,
   "content": String,
   "type": String

})

var NotificationStaff = mongoose.model('NotificationStaff', NotificationStaffSchema, 'notificationstaff')
module.exports = NotificationStaff