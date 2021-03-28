var mongoose = require('mongoose');
var StaffSchema = new mongoose.Schema({
   "fullnameStaff": String,
   "usernameStaff": String,
   "passwordStaff":String,
   "birthdayStaff": Date,
   "addressStaff": String,
   "activity": [],
   "status": String,
   "IDCardStaff": String,
   "sex": String,
   "birthPlace": String,
   "joinDay": Date,
   "idWork": [],
   "time": [String],
   "datework": [String],
})
var Staff =  mongoose.model('Staff', StaffSchema, 'staff');
module.exports = Staff;