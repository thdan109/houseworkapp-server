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
      const firstStatus = 'Đang chờ xác nhận'
      const washing = await Washing.create({
         idUser: req.body.userID,
         fullname: req.body.userName,
         address: req.body.address,
         dateSend: req.body.dateSend,
         dateTake: req.body.dateTake,
         timeSend: req.body.sendTime,
         timeTake: req.body.takeTime,
         status: firstStatus,
         note: req.body.note,
         money: req.body.money
      })

   })

   // router.post('/addStaff', async(req,res)=>{
      
   //    // console.log(req.body);
   //    const timeSend = req.body.dttime[0].timeSend
   //    const timeTake = req.body.dttime[1].timeTake
   //    const dateSend = req.body.dttime[2].dateSend
   //    const dateTake = req.body.dttime[3].dateTake
   //    const idStaff = req.body.id;
   //    const idWash = req.body.dttime[4].id

   //    const getStaff = await Staff.findOne({ _id: idStaff })

   //    const nameStaff = getStaff.fullnameStaff
   //    // console.log(getStaff);
   //    // console.log(idStaff,idWash);

   //    await Washing.findOne({ _id: idWash }).then(data =>{
   //       const condition = { _id: idWash }
   //       const process = {
   //          $push: 
   //          {
   //             idStaff :{ $each: [idStaff]},
   //             staff: { $each: [nameStaff]} 
   //          }
   //       }
   //       Washing.updateOne(condition, process).then(()=>{

   //       })
   //    })

   //    await Staff.findOne({ _id: idStaff}).then(data =>{
   //       const condition= {_id: idStaff}
   //       const process = {
   //          $push: {
   //             idWork: {$each: [idWash]},
   //             time: {$each: [timeTake]},
   //             time: {$each: [timeSend]},
   //             datework: {$each: [dateTake]},
   //             datework: {$each: [dateSend]}
   //          }
   //       }
   //       Staff.updateOne(condition, process).then(()=>{
            
   //       })
   //    })
   // })
   router.post('/addStaff', async(req, res)=>{
      console.log(req.body.data);
      const t = req.body.dataStaff;
      var keys = [];
      var ids = [];
      for (var key in t) {
         if (t.hasOwnProperty(key)) {
            if (t[key] === true){
               ids.push(key)
               // console.log(key);
            }
            }
      }
     for ( var i in ids){
         // console.log(ids[i]);
         const idStaff = ids[i]
         const timeSend = req.body.data[0].timeSend
         const timeTake = req.body.data[1].timeTake
         const dateSend = req.body.data[2].dateSend
         const dateTake = req.body.data[3].dateTake
         const idWash = req.body.data[4].id
         const getStaff = await Staff.findOne({ _id: idStaff })
         const nameStaff = getStaff.fullnameStaff

         // console.log(nameStaff);
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
      }
   })
module.exports = router
