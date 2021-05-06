var mongoose = require('mongoose')
var NotificationSchema = new mongoose.Schema({

   "idUser": {type:  mongoose.Schema.Types.ObjectId, ref: 'User'},
   "date": Date,
   "content": String,
   "type": String

})

var Notification =  mongoose.model('Notification', NotificationSchema, 'notification')
module.exports = Notification