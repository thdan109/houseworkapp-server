var express = require('express')
var router = express.Router()

var Chat  = require('../model/chat.model')
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

   router.post('/listChat', async(req,res)=>{
      const data =  await Chat.find({idStaff: req.body.id}).populate('idUser').populate({path: 'idStaff', select: 'avatarStaff'})
      // data.map(dt =>{
      //    console.log(dt.idStaff)
      // })
      // console.log(data);
      if (data !== null){
         res.status(200).send(data)
      }else{
         res.status(200).send({data: 'No'})
      }
   })
   router.post('/listChatUser', async(req,res)=>{
      const data =  await Chat.find({idUser: req.body.id}).populate('idUser').populate({path: 'idStaff', select: 'avatarStaff'})
      // data.map(dt =>{
      //    console.log(dt.idStaff)
      // })
      // console.log(data);
      if (data !== null){
         res.status(200).send(data)
      }else{
         res.status(200).send({data: 'No'})
      }
   })



module.exports = router