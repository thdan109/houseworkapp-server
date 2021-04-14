var validator = require('express-validator');
var bcrypt  = require('bcrypt');
var jwt = require('jsonwebtoken');
var JWT_KEY = process.env.JWT_KEY;


var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
   "fullname": String,
   "username": String,
   "avatar": String, 
   "password": String,
   "phone": String,
   "email": String,
   "birthday": Date,
   "address": String,
   "IDCard": String,
   "sex": String,
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


userSchema.pre('save', async function (next) {
   // Hash the password before saving the user model
   const user = this
   if (user.isModified('password')) {
       user.password = await bcrypt.hash(user.password, 8)
   }
   next()
})

// userSchema.methods.generateAuthToken = async function(tokenDevices) {
   userSchema.methods.generateAuthToken = async function(tokenDevices) {
   // Generate an auth token for the user
   const user = this
   const token = jwt.sign({_id: user._id},'hdan') 
   user.tokens = user.tokens.concat({token,tokenDevices:'tokenDevices'})
   
   await user.save()
   return token
  
}

userSchema.statics.findByCredentials = async function (username, password) {
   // Search for a user by email and password.
   const user = await User.findOne({ username } )
   if (!user) {
       throw new Error({ error: 'Invalid login credentials' })
   }
   const isPasswordMatch = await bcrypt.compare(password, user.password)
   if (!isPasswordMatch) {
       throw new Error({ error: 'Invalid login credentials' })
   }
   return user
}
//data User








var User = mongoose.model('User', userSchema, 'user');
module.exports = User;