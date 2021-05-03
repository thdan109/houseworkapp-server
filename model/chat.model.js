var mongoose = require('mongoose')
var User = require('./customer.model')
var chatSchema = new mongoose.Schema({
   "idRoom": String,
   "idStaff": [],
   "idUser": {type:  mongoose.Schema.Types.ObjectId, ref: 'User'},
   "nameUser":String,
   "messages": []
})

var Chat = mongoose.model('Chat', chatSchema, 'chat')
module.exports = Chat