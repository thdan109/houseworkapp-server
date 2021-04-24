var express = require('express');
const auth = require('../middleware/auth');
var router = express.Router();
var Cooking = require('../model/cooking.model')
var Staff = require('../model/staff.model')
var User = require('../model/customer.model')
const { default: Axios } = require('axios');

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
      const firstStatus = "Đang chờ xác nhận"
      // console.log(req.query);
      
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
            fruit: req.query.dtfruit,
            time: req.query.dtTime,
            number: req.query.dtnumCus,
            status: firstStatus,
            money: req.query.dtMoney
         })
         await cooking.save()
         console.log('oke');
      }catch{
        console.log('aaaa');
      }
   })

   router.post('/confirmWork', async(req,res)=>{
      // console.log(req.body)
      await Cooking.findOne({_id: req.body.id}).then(data =>{
         const condition = {_id: req.body.id}
         const process = {
            status: req.body.status
         }
         Cooking.updateOne(condition, process).then(()=>{
            
         })

      }) 
   })

   router.post('/addStaff', async(req,res) =>{
      // console.log(req.body.data);
      const t = req.body.dataStaff;
      var status = "Đã xác nhận"
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
         const time= req.body.data[0].time;
         const date = req.body.data[1].date
         const idCooking = req.body.data[3].id;
         const idUser = req.body.data[2].idUser;
         const idStaff = ids[i]
         const getStaff =  await Staff.findOne({_id: idStaff})
         const nameStaff = getStaff.fullnameStaff
         
         const user = await User.findOne({ _id: idUser})
         const dataCooking = await Cooking.findOne({ _id: idCooking})

         for (var i of getStaff.tokens ){
            sendPushNotificationStaff( i.tokenDevices, dataclear.timeStart,dataclear.date.toDateString() )
         }

         for ( var i of user.tokens){
            sendPushNotification(i.tokenDevices, status,dataCooking.date.toDateString())
         }

         

         // console.log(nameStaff);
         await Cooking.findOne({_id: idCooking}).then(data =>{
            const condition = {_id: idCooking}
            const process = {
               $push:
               {
                  idStaff: {$each : [idStaff] },
                  staff:   {$each: [nameStaff]},
               },
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
      }

      await Cooking.findOne({_id: req.body.data[2].id}).then(data =>{
         const condition = { _id: req.body.data[2].id }
         const process = { status: status }
         Cooking.updateOne(condition, process).then(()=>{

         })
      })

   })
   router.post('/updateStatusWorking', async(req,res) =>{
      // console.log(req.body);
      const id = req.body.id
      var status = "Đang thực hiện"
      await Cooking.findOne({_id: id}).then(data=>{
         const condition = { _id: id }
         const process = { status: status }
         Cooking.updateOne(condition, process).then(()=>{
            
         })
      })

   })

   router.post('/workStaff', async(req, res) =>{
      const work =  await Cooking.find({idStaff: req.body.id, date: req.body.nowDate })
      if (!work){
         res.status(200).send({work: 'Failed'})
      }else{
         res.status(200).send(work)
      }
      
   })
   
   router.post('/workStaffById',async(req,res) =>{
      const workById = await Cooking.findOne({ idStaff: req.body.idStaff, _id: req.body.idWork })
      res.status(200).send(workById)
   })

   router.post('/changeStatus', async(req,res)=>{
      // console.log(req.body)
      const id = req.body.id
      var status = null
      if (req.body.status == 0 ){
         status = "Xác nhận"
      }else if ( req.body.status == 1){
         status = "Đang thực hiện"
      }
      await Cooking.findOne({ _id: id}).then(data =>{
         const condition = { _id: id }
         const process = {
            status : status
         }
         Cooking.updateOne(condition, process).then(()=>{
            res.status(200).send({notifi : "Oke"})
         })
      })
   })

   async function sendPushNotificationStaff(expoPushToken,i,date) {
      var text = i + ' giờ ' + date
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Đã thêm một việc',
        body: text,
        data: { data: 'goes here' },
      };
      await Axios.post('https://exp.host/--/api/v2/push/send', JSON.stringify(message), {
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
       
      });
    }
   async function sendPushNotification(expoPushToken,i,date) {
      var text = 'Việc của bạn đã được xác nhận'
    
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Nấu ăn: '+ date,
        body: text,
        data: { data: 'goes here' },
      };
      await Axios.post('https://exp.host/--/api/v2/push/send', JSON.stringify(message), {
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
       
      });
    }

module.exports = router;