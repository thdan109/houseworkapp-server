var express = require('express');
const auth = require('../middleware/auth');
var router = express.Router();
var Cooking = require('../model/cooking.model')
var Staff = require('../model/staff.model')

   router.get('/dataCooking',async(req,res)=>{
      Cooking.find({}).then(data=>{
         res.json(data)
      })
   })

   router.get('/create',auth,async(req, res)=>{
      req.user.tokens = req.user.tokens.filter((token) => {
         return token.token == req.token
      })
      const user = req.user
      console.log(req.query);
      
      var json = JSON.parse(req.query.dtdish);
      // console.log(json);     
      const dt = Object.entries(json).map(([key, value])=>{
          return (`${value}`)
      })
      // console.log(dt);
      try {
         const cooking = new  Cooking({
            idUser: req.user._id,
            fullname: req.user.fullname,
            address: req.query.dtaddress,
            date: req.query.dtdate,
            dishList: dt,
            goMarket: req.query.dtMarket,
            time: req.query.dtTime,
            number: req.query.dtnumCus,
            money: req.query.dtMoney
         })
         await cooking.save()
         console.log('oke');
      }catch{
        console.log('aaaa');
      }
   })

   router.post('/addStaff', async(req,res)=>{
      // console.log(req.body);
      // console.log(req.body.dttime[0].time);
      // console.log(req.body.dttime[1].date)
      // console.log(req.body.dttime[2].id);
      const time= req.body.dttime[0].time;
      const date = req.body.dttime[1].date
      const idStaff = req.body.id;
      const idCooking = req.body.dttime[2].id;
      const getStaff =  await Staff.findOne({_id: idStaff})
     
      const nameStaff = getStaff.fullnameStaff
      console.log(getStaff.fullnameStaff, idCooking,date,time,idStaff,nameStaff);
      await Cooking.findOne({_id: idCooking}).then(data =>{
         const condition = {_id: idCooking}
         const process = {
            $push:
            {
               idStaff: {$each : [idStaff] },
               staff:   {$each: [nameStaff]}
            }
         }
         Cooking.updateOne(condition, process).then(()=>{
         })
      })
      await Staff.findOne({ _id: idStaff }).then(data =>{
         const condition = { _id: idStaff }
         const process = { 
            $push:
            {
               idWork: {$each: [idCooking]},
               time: {$each: [time]},
               datework: {$each: [date]}
            }
         }
         Staff.updateOne( condition, process ).then(()=>{
         })
      })
   })



module.exports = router;