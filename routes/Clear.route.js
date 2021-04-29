var express = require('express')
var router = express.Router()
var Clear = require('../model/clear.model')
const User = require('../model/customer.model')
var Staff = require('../model/staff.model')
var Service = require('../model/service.model')
const { default: Axios } = require('axios');

   router.get('/getData', async(req,res) =>{
      const clear = await Clear.find({})
      res.status(200).send(clear)
      
   })

   router.get('/getDataForApp', async(req, res) =>{
      const dataForApp = await Service.findOne({type: "clear"})
      // res.status(200).send(dataForApp)

      const a = dataForApp.prince.map(dt => dt.split(' : '))
      const data = a.map(dt1=>(dt1[1])) 
      res.status(200).send({dataForApp,data})
   })

   router.post('/test', async(req,res)=>{
      console.log(req.body);
   })



   router.post('/create', async(req,res)=>{
      const firstStatus = "Đang chờ xác nhận"
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
         status: firstStatus,
         numRoom: req.body.numberroom,
         money: req.body.money
      })
   })

   router.post('/workStaff', async(req, res) =>{
      const work =  await Clear.find({idStaff: req.body.id, date: req.body.nowDate })
      if (!work){
         res.status(200).send({work: 'Failed'})
      }else{
         res.status(200).send(work)
      }
   
   })
   router.post('/workStaffAll', async(req, res) =>{
      const work =  await Clear.find({idStaff: req.body.id })
      if (!work){
         res.status(200).send({work: 'Failed'})
      }else{
         res.status(200).send(work)
      }
   
   })

   router.post('/confirmWork', async(req,res)=>{
      // console.log(req.body)
      await Clear.findOne({_id: req.body.id}).then(data =>{
         const condition = {_id: req.body.id}
         const process = {
            status: req.body.status
         }
         Clear.updateOne(condition, process).then(()=>{
            res.send(200)
         })

      }) 
   })

   router.post('/workStaffById',async(req,res) =>{
      const workById = await Clear.findOne({ idStaff: req.body.idStaff, _id: req.body.idWork })
      res.status(200).send(workById)
   })


   router.post('/addStaff', async(req, res)=>{
      // console.log(req.body.dataStaff);
      var status = "Đã xác nhận"
      const t = req.body.dataStaff;
      var keys = [];
      var ids = [];
      for (var key in t) {
         if (t.hasOwnProperty(key)) {
            if (t[key] === true){
               ids.push(key)
            }
            }
      }
      for ( var i in ids){
         const time= req.body.data[0].time;
         const date = req.body.data[1].date
         const idStaff = ids[i]
         const idClear = req.body.data[2].id;
         const idUser = req.body.data[3].idUser;
         const getStaff =  await Staff.findOne({_id: idStaff})
         
         const user = await User.findOne({_id: idUser})
         const dataclear = await Clear.findOne({ _id: idClear })
         for (var i of getStaff.tokens ){
            sendPushNotificationStaff( i.tokenDevices, dataclear.timeStart,dataclear.date.toDateString() )
         }

         for ( var i of user.tokens){
            sendPushNotification(i.tokenDevices, status,dataclear.date.toDateString())
         }
         const nameStaff = getStaff.fullnameStaff
         
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
            const process1 ={ $inc:  { numberWorkMonth: 1 }}
            Staff.updateOne( condition, process1).then(()=>{

            })
         })
      }
      await Clear.findOne({ _id :  req.body.data[2].id }).then(data =>{
         const condition = { _id: req.body.data[2].id }
         const process = { status: status }
         Clear.updateOne(condition, process).then(()=>{
         })
      })
   })

   router.post('/updateStatusWorking', async(req,res) =>{
      // console.log(req.body);
      const id = req.body.id
      var status = "Đang thực hiện"
      await Clear.findOne({_id: id}).then(data=>{
         const condition = { _id: id }
         const process = { status: status }
         Clear.updateOne(condition, process).then(()=>{
            res.status(200).send({update: 'Oke'})
         })
      })
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
      await Clear.findOne({ _id: id}).then(data =>{
         const condition = { _id: id }
         const process = {
            status : status
         }
         Clear.updateOne(condition, process).then(()=>{
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
        title: 'Dọn nhà: '+ date,
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

module.exports =  router;