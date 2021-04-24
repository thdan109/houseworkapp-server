var express =  require('express')
var router = express.Router()
var Clear = require('../model/clear.model')
var ClearSave = require('../model/clearsave.model')

router.post('/create', async(req,res)=>{
   // console.log(req.body);
   const work = req.body.work
   await ClearSave.create({
      idWork: work._id,
      idStaff: work.idStaff,
      idUser: work.idUser,
      username: work.username,
      address: work.address,
      date: work.date,
      area: work.area,
      numRoom: work.numRoom,
      timeWork: work.timeWork,
      timeStart: work.timeStart,
      money: work.money
   }).then(data =>{
      Clear.findOne({_id: work._id  }).then(result =>{
         const condition = { _id: work._id}
         const process = {status: "Đã thanh toán"}
         Clear.updateOne(condition, process).then(()=>{

         })
      })
      res.status(200).send({status: "Successfull!"})
   }).catch(err =>{
      // res.status(400).send
   })
})

module.exports = router