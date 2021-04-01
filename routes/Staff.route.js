var express = require('express')
var router = express.Router();

var dataStaff = require('../model/staff.model.js')
var Schedule = require('../model/schedule.model.js')


//Gủi dữ liệu 
router.get('/dataStaff', (req, res) =>{
   dataStaff.find({}).then(result=>{
      res.json(result)
   })
})
// router.post('/statusStaff', (req, res)=>{
//    const time = req.body.dttime[0].time
//    const date = req.body.dttime[1].date

//       //console.log(time, date)
//    dataStaff.find({time: time},{date:date}).then(data=>{
//       res.json(data)
//       // console.log(data);
//    })
// })
router.post('/statusStaff', async(req, res)=>{
   const time = req.body.dttime[0].time
   const date = req.body.dttime[1].date
   const dts = await dataStaff.find({time : { $ne : time}, datework : { $ne : date} })
   res.status(200).send(dts)
})
   router.post('/statusStaffWash', async(req, res) =>{
      const timeSend = req.body.dttime[0].timeSend
      const timeTake = req.body.dttime[1].timeTake
      const dateSend = req.body.dttime[2].dateSend
      const dateTake = req.body.dttime[3].dateTake
      const dataTimeWash = await dataStaff.find({ time: { $ne: timeSend}, time: {$ne: timeTake},date : {$ne: dateSend}, date: { $ne:  dateTake}  })
      res.status(200).send(dataTimeWash)
      // console.log(dataTimeWash)
     })

//Thêm nhân viên
router.post('/addStaff',(req, res) =>{
   const PostdataStaff = req.body;
   dataStaff.create({
      fullnameStaff: PostdataStaff.fullnameStaff,
      usernameStaff: PostdataStaff.usernameStaff,
      passwordStaff: PostdataStaff.passwordStaff,
      birthdayStaff: PostdataStaff.birthdayStaff,
      addressStaff: PostdataStaff.addressStaff,
      IDCardStaff: PostdataStaff.IDCardStaff,
      sex: PostdataStaff.sex,
      birthPlace: PostdataStaff.birthPlace,
      joinDay: PostdataStaff.joinDay,
   })
})
//Xóa nhân viên
router.get('/delStaff/id=:idStaff',function(req,res){
   const idStaff = req.params.idStaff;
   console.log(idStaff);
   dataStaff.deleteOne({_id: idStaff}).then(res =>{
      res.status(200).send(
         { delStaff : true }
      )
   }).catch(error =>{
      res.status(200).send({
         del: false
      })
   })
})
//Chỉnh sửa thông tin nhân viên
router.post('/updatedataStaff', function(req,res){
   const updateDataStaff = req.body;
   const idStaff = updateDataStaff._id;
   dataStaff.findOne({ _id: idStaff }).then(res => {
      const condition = { _id: idStaff };
      const process = {
         fullnameStaff: updateDataStaff.fullnameStaff,
         usernameStaff: updateDataStaff.usernameStaff,
         passwordStaff: updateDataStaff.passwordStaff,
         birthdayStaff: updateDataStaff.birthdayStaff,
         addressStaff: updateDataStaff.addressStaff,
         IDCardStaff: updateDataStaff.IDCardStaff,
         sex: updateDataStaff.sex,
         birthPlace: updateDataStaff.birthPlace,
         joinDay: updateDataStaff.joinDay,
      }
      dataStaff.updateOne(condition, process).then(()=>{
         // res.send(200)
      })
   })
})

module.exports = router;