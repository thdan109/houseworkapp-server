var express = require('express')
var router = express.Router()
var Clear = require('../model/clear.model')
var Staff = require('../model/staff.model')

   router.get('/getData', async(req,res) =>{
      const clear = await Clear.find({})
      res.status(200).send(clear)
      console.log(clear);
   })

   router.post('/create', async(req,res)=>{
      // console.log(req.body);
      // console.log(req.body.time);
      await Clear.create({
         idUser: req.body.userID,
         username: req.body.userName,
         address: req.body.address,
         date: req.body.date,
         area: req.body.area,
         timeStart: req.body.time,
         timeWork: req.body.timework,
         numRoom: req.body.numberroom,
         money: req.body.money
      })
   })

   // router.post('/addStaff', async(req,res)=>{
   //    // console.log(req.body);
   //    // console.log(req.body.dttime[0].time);
   //    // console.log(req.body.dttime[1].date)
   //    // console.log(req.body.dttime[2].id);
   //    const time= req.body.dttime[0].time;
   //    const date = req.body.dttime[1].date
   //    const idStaff = req.body.id;
   //    const idClear = req.body.dttime[2].id;
   //    const getStaff =  await Staff.findOne({_id: idStaff})
     
   //    const nameStaff = getStaff.fullnameStaff
   //    // console.log(getStaff.fullnameStaff, idClear, date,time,idStaff,nameStaff);
   //    await Clear.findOne({_id: idClear}).then(data =>{
   //       const condition = {_id: idClear}
   //       const process = {
   //          $push:
   //          {
   //             idStaff: {$each : [idStaff] },
   //             nameStaff:   {$each: [nameStaff]}
   //          }
   //       }
   //       Clear.updateOne(condition, process).then(()=>{
   //       })
   //    })
   //    await Staff.findOne({ _id: idStaff }).then(data =>{
   //       const condition = { _id: idStaff }
   //       const process = { 
   //          $push:
   //          {
   //             idWork: {$each: [idClear]},
   //             time: {$each: [time]},
   //             datework: {$each: [date]}
   //          }
   //       }
   //       Staff.updateOne( condition, process ).then(()=>{
   //       })
   //    })
   // })

   router.post('/addStaff', async(req, res)=>{
      console.log(req.body.dataStaff);
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
         const time= req.body.data[0].time;
         const date = req.body.data[1].date
         const idStaff = ids[i]
         const idClear = req.body.data[2].id;
         const getStaff =  await Staff.findOne({_id: idStaff})
        
         const nameStaff = getStaff.fullnameStaff
         // console.log(getStaff.fullnameStaff, idClear, date,time,idStaff,nameStaff);
         await Clear.findOne({_id: idClear}).then(data =>{
            const condition = {_id: idClear}
            const process = {
               $push:
               {
                  idStaff: {$each : [idStaff] },
                  nameStaff:   {$each: [nameStaff]}
               }
            }
            Clear.updateOne(condition, process).then(()=>{
            })
         })
         await Staff.findOne({ _id: idStaff }).then(data =>{
            const condition = { _id: idStaff }
            const process = { 
               $push:
               {
                  idWork: {$each: [idClear]},
                  time: {$each: [time]},
                  datework: {$each: [date]}
               }
            }
            Staff.updateOne( condition, process ).then(()=>{
            })
         })
     }
   })

module.exports =  router;