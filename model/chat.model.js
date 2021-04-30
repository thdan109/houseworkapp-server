var mongoose = require('mongoose')
var chatSchema = new mongoose.Schema({
   "idRoom": String,
   "idStaff": [],
   "idUser": String,
   "messages": []
})

var Chat = mongoose.model('Chat', chatSchema, 'chat')
module.exports = Chat