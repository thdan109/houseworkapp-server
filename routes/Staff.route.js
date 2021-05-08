var express = require('express')
var router = express.Router();
const multer = require("multer");
var authStaff = require("../middleware/authStaff")
var dataStaff = require('../model/staff.model.js')
var Schedule = require('../model/schedule.model.js')
var Leave = require('../model/leave.model')



var storage = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, "./public/images/staffs")
   },
   filename: function (req, file, cb) {
      //  console.log(file.originalname);
       cb(null, file.fieldname + '-' + Date.now() + file.originalname)
   }
})

const uploadStaff = multer({storage: storage});

//Gủi dữ liệu 
router.get('/dataStaff', (req, res) =>{
   dataStaff.find({}).then(result=>{
      res.json(result)
   })
})

router.post('/getStaffById', async(req, res)=>{
   // console.log(req.body);
   const id = req.body.id
   const staff = await dataStaff.findOne({_id: id})
   if (!staff){
      // console.log('sai');
      res.status(200).send({error: "Failed!"})
   }else{
      // console.log('Dung');
      res.status(200).send(staff)
   }
   
   // console.log(data)
})

router.get('/getStaffByIdLoading', authStaff, async(req,res) =>{
   res.status(200).send(req.staff)
})


router.post('/statusStaff', async(req, res)=>{


   const condition = "Bộ phận Vệ sinh nhà"
   const time = req.body.dttime[0].time
   const date = req.body.dttime[1].date
   // const datetest  = '2021-05-13T17:00:00.000Z'

   const dleave = await Leave.find({$and:  [{date: date}, {status: 'Đã duyệt'}] })

   // console.log(dleave);
   const idLeave = []
   dleave.map(dt =>{
       idLeave.push(dt.idStaff)
   })
   // console.log(idLeave);
   // const dts = await dataStaff.find({ $and: [{department: condition},{$or: [ {time : { $ne : time}}, {datework : { $ne : date} } ]} ] } )
   // res.status(200).send(dts)
   const dts = []
   if ( idLeave.length === 0){
      const dts =  await dataStaff.find({ $and: [{department: condition},{$or: [ {time : { $ne : time}}, {datework : { $ne : date} } ]} ] } )
      res.status(200).send(dts)
   }else if (idLeave.length > 0)
      {for ( var i of idLeave){
         console.log(i);
         await dataStaff.findOne({ $and: [{_id: {$ne: i}},{department: condition},{$or: [ {time : { $ne : time}}, {datework : { $ne : date} } ]} ] } ).then(res =>{
            // console.log(res);
            dts.push(res)
      })
      res.status(200).send(dts)
   }}
   
   // console.log(dts);
   // res.status(200).send(dts)


})
router.post('/statusStaffCooking', async(req, res)=>{
   const condition = "Bộ phận Nấu ăn"
   const time = req.body.dttime[0].time
   const date = req.body.dttime[1].date
         // date.setDate(date.setDate()+1)

   const dleave = await Leave.find({$and:  [{date: date}, {status: 'Đã duyệt'}] })
   const idLeave = []
   dleave.map(dt =>{
       idLeave.push(dt.idStaff)
   })
   const dts = []
   if ( idLeave.length === 0){
      const dts1 = await dataStaff.find({ $and: [{department: condition},{$or: [ {time : { $ne : time}}, {datework : { $ne : date} } ]} ] } )
      res.status(200).send(dts1)
   }else if (idLeave.length > 0)
      {for ( var i of idLeave){
         console.log(i);
         await dataStaff.findOne({ $and: [{_id: {$ne: i}}, {department: condition},{$or: [ {time : { $ne : time}}, {datework : { $ne : date} } ]} ] } )
         .then(res => {
          // console.log(res);
            dts.push(res)
      })
      res.status(200).send(dts)
   }}

   // const dts = await dataStaff.find({ $and: [{department: condition},{$or: [ {time : { $ne : time}}, {datework : { $ne : date} } ]} ] } )
   // res.status(200).send(dts)
})
router.post('/statusStaffWash', async(req, res) =>{

   const timeSend = req.body.dttime[0].timeSend
   const timeTake = req.body.dttime[1].timeTake
   const dateSend = req.body.dttime[2].dateSend
         // dateSend.setDate(dateSend.setDate()+1)
   const dateTake = req.body.dttime[3].dateTake
         // dateTake.setDate(dateTake.setDate()+1)
   const departmentCondition ="Bộ phận Giặt ủi"

   // Tim trong leave
   const dleave = await Leave.find({$and:  [{date: dateSend} ,{date: dateTake}, {status: 'Đã duyệt'}] })
   const idLeave = []
   dleave.map(dt =>{
       idLeave.push(dt.idStaff)
   })
   const dts = []
   if ( idLeave.length === 0){
      const dataTimeWash = await dataStaff.find({ $and: [ {department: departmentCondition}, {$or: [ {$and: [{time: { $ne: timeSend}}, {time: {$ne: timeTake}}]},{$and: [{datework : {$ne: dateSend}}, { datework: { $ne:  dateTake}}]} ]}] })
      res.status(200).send(dataTimeWash)
   }else if (idLeave.length > 0){
      {for ( var i of idLeave){
         await dataStaff.findOne({ $and: [{_id: {$ne: i}}, {department: departmentCondition}, {$or: [ {$and: [{time: { $ne: timeSend}}, {time: {$ne: timeTake}}]},{$and: [{datework : {$ne: dateSend}}, { datework: { $ne:  dateTake}}]} ]}] })
         .then( res =>{
            dts.push(res)
         })
      }
      res.status(200).send(dts)
      }
   }
   

   // const condition = " $and: [ {department: departmentCondition}, {$or: [ {$and: [{time: { $ne: timeSend}}, {time: {$ne: timeTake}}]},{$and: [{datework : {$ne: dateSend}}, { datework: { $ne:  dateTake}}]} ]}] "
   // const dataTimeWash = await dataStaff.find({ time: { $ne: timeSend}, time: {$ne: timeTake},datework : {$ne: dateSend}, datework: { $ne:  dateTake}  })
   // const dataTimeWash = await dataStaff.find({ $and: [ {department: departmentCondition}, {$or: [ {$and: [{time: { $ne: timeSend}}, {time: {$ne: timeTake}}]},{$and: [{datework : {$ne: dateSend}}, { datework: { $ne:  dateTake}}]} ]}] })
   // res.status(200).send(dataTimeWash)
   // console.log(dataTimeWash)
})

//Thêm nhân viên
router.post('/addStaff',uploadStaff.single('files'),async(req,res)=>{
   console.log((req.file));
   console.log(req.body);
   const joinDay =  new Date()
   try{
      const staff = new dataStaff({
         fullnameStaff: req.body.fullnameStaff,
         usernameStaff: req.body.usernameStaff,
         passwordStaff: req.body.passwordStaff,
         birthdayStaff: req.body.birthdayStaff,
         avatarStaff: req.file.path,
         numberPhone: req.body.numberPhone,
         addressStaff: req.body.addressStaff,
         IDCardStaff: req.body.IDCardStaff,
         sex: req.body.genderStaff,
         birthPlace: req.body.birthPlace,
         joinDay: joinDay,
         department: req.body.department,
         absent: 0,
         numberWorkMonth: 0
      })
      // console.log(staff);
      await staff.save()
      const token = await staff.generateAuthToken()
      res.status(201).send({status: 'Oke'})
      res.status(201).send({staff,token})
    }catch(err){
      res.status(400).send(err)
    }

})

//Login Staff

router.post('/login',async(req,res) =>{
   // console.log(req.body);
   const usernameStaff = req.body.usernameStaff
   const passwordStaff = req.body.passwordStaff
   const tokenDevice = req.body.tokenDevice
   // console.log(username, password);
   try
      {
         // tokenDevices = "tokenDevices"
         const staff = await dataStaff.findByCredentials(usernameStaff, passwordStaff)
         if (!staff) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
         }
         const token = await staff.generateAuthToken(tokenDevice)
         res.status(201).send({staff, token})
      }catch (error) { 
         res.status(400).send(error)
      }
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
//logout
router.get('/logout', authStaff, async(req,res)=>{
   // console.log("log");
   try {
       req.staff.tokens = req.staff.tokens.filter((token) => {
           return token.token != req.token
       })
       await req.staff.save()
       res.status(200).send("logout complete")
   } catch (error) {
       res.status(500).send("err")
   }
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