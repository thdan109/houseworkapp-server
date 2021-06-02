var mongoose= require('mongoose')
var FeedBackSchema = new mongoose.Schema({
   "idWork": String,
   "idUser":String,
   "nameUser": String,
   "contentfeedback":String,
   "rate": String,
   "type":String
})

var FeedBack =  mongoose.model('FeedBack', FeedBackSchema ,'feedback')
module.exports = FeedBack