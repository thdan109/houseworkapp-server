var express = require('express')
var router = express.Router()

var Chat  = require('../model/admin.model')
var Staff = require('../model/staff.model')
var User = require('../model/customer.model')

   router.post('/dataChatStaff', async(req, res) =>{
      const dataChat = await Chat.find({ idStaff:   req.body.idStaff})
      if (dataChat){
         res.status(200).send(dataChat)
      }else{
         console.log('error');
      }
   })



module.exports = router