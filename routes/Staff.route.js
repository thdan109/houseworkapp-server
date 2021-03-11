var express = require('express')
var router = express.Router();

var dataStaff = require('../model/staff.model.js')


//Gủi dữ liệu 
router.get('/dataStaff', (req, res) =>{
   dataStaff.find({}).then(result=>{
      res.json(result)
   })
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