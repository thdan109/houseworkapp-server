var express = require('express')
var router = express.Router()
var Washing = require('../model/washing.model')
var Staff = require('../model/staff.model')
   router.get('/getData', async(req,res)=>{
      const dataWashing = await Washing.find({})
      res.status(200).send((dataWashing)) 
   })

   router.post('/create', async(req,res)=>{
      // console.log(req.body.dateTake);
      const washing = await Washing.create({
         idUser: req.body.userID,
         fullname: req.body.userName,
         address: req.body.address,
         dateSend: req.body.dateSend,
         dateTake: req.body.dateTake,
         timeSend: req.body.sendTime,
         timeTake: req.body.takeTime,
         note: req.body.note,
         money: req.body.money
      })

   })

   router.post('/addStaff', async(req,res)=>{
      
      // console.log(req.body);
      const timeSend = req.body.dttime[0].timeSend
      const timeTake = req.body.dttime[1].timeTake
      const dateSend = req.body.dttime[2].dateSend
      const dateTake = req.body.dttime[3].dateTake
      const idStaff = req.body.id;
      const idWash = req.body.dttime[4].id

      const getStaff = await Staff.findOne({ _id: idStaff })

      const nameStaff = getStaff.fullnameStaff
      // console.log(getStaff);
      // console.log(idStaff,idWash);

      await Washing.findOne({ _id: idWash }).then(data =>{
         const condition = { _id: idWash }
         const process = {
            $push: 
            {
               idStaff :{ $each: [idStaff]},
               staff: { $each: [nameStaff]} 
            }
         }
         Washing.updateOne(condition, process).then(()=>{

         })
      })

      await Staff.findOne({ _id: idStaff}).then(data =>{
         const condition= {_id: idStaff}
         const process = {
            $push: {
               idWork: {$each: [idWash]},
               time: {$each: [timeTake]},
               time: {$each: [timeSend]},
               datework: {$each: [dateTake]},
               datework: {$each: [dateSend]}
            }
         }
         Staff.updateOne(condition, process).then(()=>{
            
         })
      })
   })
module.exports = router
