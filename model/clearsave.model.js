var moongose = require('mongoose')
var clearsaveSchema = new moongose.Schema({
   "idWork": String,
   "idStaff": [],
   "idUser": String,
   "username":String,
   "address": String,
   "date": Date,
   "area": String,
   "numRoom": String,
   "timeWork":String,
   "timeStart": String,
   "money": String
})
var ClearSave = moongose.model('ClearSave' ,clearsaveSchema, 'clearsave')
module.exports = ClearSave