var mongoose = require('mongoose');
var WorkSchema = new mongoose.Schema({
   "nameCusomer": String,
   "nameService": String,
   "note": String,
   "postTime": Date,
   "status": String,   
})

var Work = mongoose.model('Work', WorkSchema, 'work');
module.exports = Work;