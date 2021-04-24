var express = require('express')
var router = express.Router()
var Washing = require('../model/washing.model')
var WashingSave = require('../model/washingsave.model')


router.post('/create', async(req,res)=>{
   const work = req.body.work
   await WashingSave.create({
      idWork: work._id,
      idUser: work.idUser,
      fullname: work.fullname,
      address: work.address,
      dateSend: work.dateSend,
      dateTake: work.dateTake,
      timeSend: work.timeSend,
      timeTake: work.timeTake,
      money: work.money
   }).then(result =>{
      Washing.findOne({_id: work._id}).then(result=>{
         const condition = { _id: work._id}
         const process = { status: "Đã thanh toán"}
         Washing.updateOne(condition, process).then(()=>{
            
         })
      })
      res.status(200).send({status: "Successfull!"})
   }).catch(err =>{
      console.log(err);
   })

})


module.exports = router