var mongoose = require('mongoose');
var VoucherSchema = new mongoose.Schema({
   "nameVoucher" : String,
   "codeVoucher": String,
   "prince": String,
   "idUser": [] 
})

var Voucher = mongoose.model('Voucher', VoucherSchema, 'voucher');
module.exports = Voucher;