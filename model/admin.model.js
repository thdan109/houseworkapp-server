var mongoose = require('mongoose');
var AdminListSchema = new mongoose.Schema({
   "username":String,
   "password": String,
   "Name":String,
   "position":String,
})

var ADList = mongoose.model('ADList', AdminListSchema, 'adminlist');
module.exports = ADList;