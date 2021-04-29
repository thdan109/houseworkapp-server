var mongoose= require('mongoose')
var FeedBackSchema = new mongoose.Schema({

   "idUser":String,
   "nameUser": String,
   "contentfeedback":String,
   "rate": String

})

var FeedBack =  mongoose.model('FeedBack', FeedBackSchema ,'feedback')
module.exports = FeedBack