var mongoose = require('mongoose')
var User = require('./customer.model')
var Staff = require('./staff.model')
var chatSchema = new mongoose.Schema({
   "idRoom": String,
   "idStaff": [{type:  mongoose.Schema.Types.ObjectId, ref: 'Staff'}],
   "idUser": {type:  mongoose.Schema.Types.ObjectId, ref: 'User'},
   "nameUser":String,
   "messages": []
})

var Chat = mongoose.model('Chat', chatSchema, 'chat')
module.exports = Chat