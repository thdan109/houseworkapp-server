var mongoose = require('mongoose')
var Staff = require('./staff.model')
var CookingSchema = new mongoose.Schema({
   "idUser": {type: String},
   "fullname": String,
   "address": String,
   "date": Date,
   "dishList": [],
   "goMarket": String,
   "fruit":String,
   "timeStart": String,
   "number": String,
   "idStaff": [],
   "staff": [],
   "status": String,
   "reqStaff": {type: mongoose.Schema.Types.ObjectId, ref: 'Staff'},
   "money": Number
})


CookingSchema.pre('save', async function (next) {
   // Hash the password before saving the user model
   const cooking = this
   // if (user.isModified('password')) {
   //     user.password = await bcrypt.hash(user.password, 8)
   // }
   next()
})

var Cooking = mongoose.model('Cooking', CookingSchema, 'cooking')
module.exports = Cooking;