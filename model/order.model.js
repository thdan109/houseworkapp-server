var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
   "nameCustomer": String,
   "nameStaff": String,
   "nameService": String,
   "totalcost": Number


})

var Order = mongoose.model('Order', OrderSchema, 'order');
module.export = Order;