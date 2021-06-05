var moongose = require('mongoose')
var cookingsaveSchema = new moongose.Schema({
   "idWork": String,
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
   "money":  Number
})

var CookingSave = moongose.model('CookingSave', cookingsaveSchema,'cookingsave')
module.exports = CookingSave