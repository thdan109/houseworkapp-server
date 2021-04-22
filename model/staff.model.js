var mongoose = require('mongoose');
var validator = require('express-validator');
var bcrypt  = require('bcrypt');
var jwt = require('jsonwebtoken');
var JWT_KEY = process.env.JWT_KEY;

var StaffSchema = new mongoose.Schema({
   "fullnameStaff": String,
   "usernameStaff": String,
   "passwordStaff":String,
   "birthdayStaff": Date,
   "numberPhone": String,
   "addressStaff": String,
   "avatarStaff": String,
   "qrStaff": String,
   "department": String,
   "activity": [],
   "status": String,
   "IDCardStaff": String,
   "sex": String,
   "birthPlace": String,
   "joinDay": Date,
   "idWork": [],
   "time": [String],
   "datework": [String],
   tokens: [{
      token: {
          type: String,
          required: true
      },
      tokenDevices: String,
      // {
      //     type: String,
      // } 
  }],
})


StaffSchema.pre('save', async function (next) {
   // Hash the password before saving the user model
   const staff = this
   if (staff.isModified('passwordStaff')) {
       staff.passwordStaff = await bcrypt.hash(staff.passwordStaff, 8)
   }
   next()
})
StaffSchema.methods.generateAuthToken = async function(tokenDevices) {
   // Generate an auth token for the user
   const staff = this
   const token = jwt.sign({_id: staff._id},'hdan') 
   staff.tokens = staff.tokens.concat({token,tokenDevices})
   await staff.save()
   return token
  
}

StaffSchema.statics.findByCredentials = async function (usernameStaff, passwordStaff) {
   // Search for a user by email and password.
   const staff = await Staff.findOne({ usernameStaff } )
   if (!staff) {
       throw new Error({ error: 'Invalid login credentials' })
   }
   const isPasswordMatch = await bcrypt.compare(passwordStaff, staff.passwordStaff)
   if (!isPasswordMatch) {
       throw new Error({ error: 'Invalid login credentials' })
   }
   return staff
}

var Staff =  mongoose.model('Staff', StaffSchema, 'staff');
module.exports = Staff;