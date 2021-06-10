var express = require('express')
var router = express.Router()
var Clear = require('../model/clear.model')
const User = require('../model/customer.model')
var Staff = require('../model/staff.model')
var Service = require('../model/service.model')
var Chat = require('../model/chat.model')
var Notification = require('../model/notification.model')
var NotificationStaff = require('../model/notificationstaff.model')
var Voucher = require('../model/voucher.model')

const { default: Axios } = require('axios');

   router.get('/getData', async(req,res) =>{
      const clear = await Clear.find({}).populate({path: 'reqStaff', select: 'fullnameStaff'})
      res.status(200).send(clear)
      // console.log(clear);
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
      // const dateprocessed  = (new Intl.DateTimeFormat('en-US').format(req.body.date))
      // console.log(req.body);
      // console.log(req.body.time);
      let staff = null
      if (!req.body.staff){
         staff = null 
      }else{
         staff = req.body.staff.id
      }
      // console.log(staff);
      
      const a  = req.body.time.split(':')
      const nextHours = Number(a[0])+Number(req.body.timework)
      const endHours = nextHours+":"+a[1]
      console.log(endHours);

      await Clear.create({
         idUser: req.body.userID,
         username: req.body.userName,
         address: req.body.address,
         date: req.body.date,
         area: req.body.area,
         timeStart: req.body.time,
         timeEnd: endHours,
         timeWork: req.body.timework,
         status: firstStatus,
         numRoom: req.body.numberroom,
         money: req.body.money,
         reqStaff: staff
      })


      const dataVoucher = req.body.voucher
      // console.log(dataVoucher);
      console.log(req.body.km);
      if (req.body.km !== 0){
         const id = dataVoucher.map(dt => dt._id)
         await Voucher.findOne({_id: id}).then(result =>{
            const condition = {_id: id}
            const process ={
               $push :
               {
                  idUser: {$each: [req.body.userID]}
               }
            }
            Voucher.updateOne(condition, process).then(()=>{

            })
         })

      }
    
   })

   router.post('/workStaff', async(req, res) =>{
      
      const work =  await Clear.find({$and: [{idStaff: req.body.id}, {date: {"$gte": new Date (Date.now(req.body.nowDate)-1*24*60*60*1000)}}, {date: { "$lt": new Date(Date.now(req.body.nowDate))}} ] })
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

   router.post('/continueWork', async(req,res)=>{
      await Clear.findOne({_id: req.body.id}).then(data =>{
         const condition =  {_id: req.body.id}
         const process = {status: req.body.status}
         Clear.updateOne(condition, process).then(()=>{
            res.send(200)
         })
      })
   })

   router.post('/cancelWork', async(req,res) =>{
      await Clear.deleteOne({_id: req.body.id}).then( result =>{
         res.status(200).send({delete: 'Oke'})
      }).catch(err =>{
         res.status(200).send({delete: 'No'})
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
      // console.log(ids);
      const idClearTB = req.body.data[2].id;
      const idUserTB = req.body.data[3].idUser;
      // console.log(idUserTB);
      const userTB = await User.findOne({_id: idUserTB})
      const dataclearTB = await Clear.findOne({ _id: idClearTB })
      for ( var i of userTB.tokens){
         sendPushNotification(i.tokenDevices,dataclearTB.date.toDateString())
      }

      var text = 'Việc của bạn đã được xếp nhân viên. Giờ bạn có thể trò chuyện với nhân viên'            
      var typeNotifi = 'Dọn dẹp nhà'

      await Notification.findOne({$and: [{idUser: idUserTB}, {date: dataclearTB.date}]}).then( result =>{
         if (result === null){
            Notification.create({
               idUser: idUserTB,
               date: dataclearTB.date,
               content: text,
               type: typeNotifi
            })
         }
      }) 

      await Clear.findOne({ _id :  req.body.data[2].id }).then( data =>{
         const condition = { _id: req.body.data[2].id }
         const process = { status: status }
          Clear.updateOne(condition, process).then(()=>{
         })
      })

      for ( var i in ids){
         const time= req.body.data[0].time;
         // const timeEnd = req.body.data[4].timeEnd
         const date = req.body.data[1].date
         const idStaff = ids[i]
         const idClear = req.body.data[2].id;
         const idUser = req.body.data[3].idUser;
         const getStaff =  await Staff.findOne({_id: idStaff})
         
         // const user = await User.findOne({_id: idUser})
         const dataclear = await Clear.findOne({ _id: idClear })

         var textNotifi = dataclear.timeStart +' '+dataclear.date.toDateString()

         for (var i of getStaff.tokens ){
            sendPushNotificationStaff( i.tokenDevices, dataclear.timeStart,dataclear.date.toDateString() )
         }

         await NotificationStaff.findOne({$and: [{idStaff: idStaff}, {date: dataclear.date}]}).then( result =>{
            if (result === null){
               NotificationStaff.create({
                  idStaff: idStaff,
                  date: dataclear.date,
                  content: textNotifi,
                  type: typeNotifi
               })
            }
         })


         // for ( var i of user.tokens){
         //    sendPushNotification(i.tokenDevices,dataclear.date.toDateString())
         // }
         const nameStaff = getStaff.fullnameStaff
         
         
         await Clear.findOne({_id: idClear}).then( data =>{
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
         await Staff.findOne({ _id: idStaff }).then( data =>{
            const condition = { _id: idStaff }
            const process = { 
               $push:
               {
                  idWork: {$each: [idClear]},
                  time: {$each: [time]},
                  // timeEnd: {$each: [timeEnd]},
                  datework: {$each: [date]}
               },
               $inc:  { numberWorkMonth: 1 }
            }
             Staff.updateOne( condition, process ).then(()=>{
            //    const process1 ={ $inc:  { numberWorkMonth: 1 }}
            //    Staff.updateOne( condition, process1).then(()=>{
  
            //   })
            })
           
         })
       
      }
      
      const idClearChat = req.body.data[2].id;
      const idUserChat = req.body.data[3].idUser;
      const userChat = await User.findOne({_id: idUserChat}) 
      const dateChat = req.body.data[1].date
      const nameUserChat = userChat.fullname
      const type = "Dọn nhà"
      await Chat.findOne({idRoom: idClearChat}).then(  result =>{
            if (result === null) {
                Chat.create({
                  idRoom: idClearChat,
                  idStaff: ids,
                  idUser: idUserChat,
                  nameUser: nameUserChat,
                  date: dateChat,
                  type: type
               })
               console.log('Tao xong roi');
            }else{
               for (var i in ids){
                  const condition = {idRoom: idClearChat}
                  const process = {
                     $push:{
                        idStaff: {$each: [ids[i]]}
                     }
                  }
                  Chat.updateOne(condition, process).then(()=>{
                     res.status(200).send({status: 'Oke'})
                  })
               }
               console.log('Update dc');
            }
      }).catch( err =>{

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
       
      }).then(()=>{

      } ).catch(()=>{

      });
    }

   async function sendPushNotification(expoPushToken,date) {
      var text = 'Việc của bạn đã được xác nhận. Giờ bạn có thể trò chuyện với nhân viên'
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
       
      }).then(()=>{

      } ).catch(()=>{
         
      });
    }

module.exports =  router;