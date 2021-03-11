var mongoose = require('mongoose');

var ServiceSchema =  new mongoose.Schema({
   "nameService": String,
   "descriptionService": String,
   "prince": []
})
var Service = mongoose.model('Service', ServiceSchema, 'service')
module.exports = Service