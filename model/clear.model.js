var mongoose = require('mongoose')
var clearSchema = new mongoose.Schema({
   "idUser": String,
   "area": Number,
   "money": String
})
var Clear = mongoose.model('Clear',clearSchema,'clear' )
module.exports = Clear;