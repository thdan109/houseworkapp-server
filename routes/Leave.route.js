var express = require('express')

var router = express.Router()
var Leave = require('../model/leave.model')
var Staff = require('../model/staff.model')
const { default: Axios } = require('axios');

router.post('/leaveOfStaffById', async(req,res) =>{
   const reason =  await Leave.find({idStaff: req.body.id })
   res.status(200).send(reason)
   // console.log(reason);
})    

router.post('/create', async(req, res )=>{
   console.log(req.body);
   const status = "Đang chờ xử lý"
   const reason = await  Leave.create({
      idStaff: req.body.id,
      nameStaff: req.body.name,
      department: req.body.department,
      status: status,
      date: req.body.date,
      reason: req.body.reason
   }).then(result =>{
      res.status(200).send({status: 'Successfully!'})
   }).catch(err =>{
      console.log(err);
   })
   
   
})

router.get('/getData', async(req, res)=>{
   const data = await Leave.find({})
   res.status(200).send(data)
})

router.post('/acceptLeave', async(req, res) =>{
   var status = ''
   if ( req.body.status === '0'){
      status = "Không được chấp thuận"
   }else if ( req.body.status  === '1'){
      status = "Đã duyệt"
   }
   // console.log(req.body.idLeave);
   await Leave.findOne({ _id: req.body.idLeave}).then(async result=>{
      const condition = {_id:  req.body.idLeave}
      const process = { status : status }
      Leave.updateOne(condition, process).then(()=>{
         res.status(200).send({complete: 'Oke'})
      }).catch(()=>{

      })
      await Staff.findOne({_id: req.body.id}).then(result =>{
         const condition ={ _id: req.body.id}
         const process ={ $inc:  { absent: 1 }}
         Staff.updateOne(condition, process).then(()=>{
            res.status(200).send({status: 'Oke'})
         }).catch(()=>{
   
         })
      })
      
   }).catch(err =>{

   })

   const staff =  await Staff.findOne({_id: req.body.idStaff})
   const leave = await Leave.findOne({_id: req.body.idLeave })

   for (var i of staff.tokens ){
      sendPushNotificationStaff( i.tokenDevices, leave.date, status)
   }
   

})

router.post('/dataLeaveById', async(req,res) =>{
   const data = await Leave.find({idStaff: req.body.id})
   res.status(200).send(data)
})

async function sendPushNotificationStaff(expoPushToken,date,status) {
   var text = 'Xin nghỉ: '+ date.toDateString()
   const message = {
     to: expoPushToken,
     sound: 'default',
     title: text,
     body: status,
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


module.exports = router