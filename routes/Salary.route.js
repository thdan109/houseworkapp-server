var express = require('express')
var router = express.Router()
var Salary = require('../model/salary.model')
var DataSalary = require('../model/dataSalary.model')
var Staff = require('../model/staff.model')
var Leave = require('../model/leave.model')

router.get('/getDataSalary', async(req,res) =>{
   const data = await DataSalary.find({})
   if (data !== null ){
      res.status(200).send(data)
      // console.log(data);
   }else{
      res.status(200).send({status: 'No'})
   }
})

router.get('/getData', async(req,res) =>{
   const data = await Salary.find({})
   if (data !== null){
      res.status(200).send(data)
   }else{
      res.status(200).send({status: 'No'})
   }
})

router.post('/updateSalary', async(req,res) =>{
   const dataUpdate = req.body.data
   const id = req.body.id
   // console.log(dataUpdate.target);
   await DataSalary.findOne({ _id: id}).then(result =>{
      if ((!dataUpdate.target) || (!dataUpdate.work) || (!dataUpdate.bonus) || (!dataUpdate.absent)){
         res.status(200).send({Update: 'Update Salary not working!'})
      } else{
         const condition ={ _id: id}
         const process = {
            target: Number(dataUpdate.target),
            bonus: Number(dataUpdate.bonus),
            absent: Number(dataUpdate.absent),
            work: Number(dataUpdate.work),
            salary: Number(dataUpdate.salary)
         }
         DataSalary.updateOne(condition, process).then(()=>{
            res.status(200).send({Update: 'Update salary successfully!'})
         })


      } 

   })
})

router.post('/countSalary', async(req, res) =>{
   const dataSalary = await DataSalary.find({})
   const work = dataSalary.map(dt => {return dt.work})
   const target = dataSalary.map(dt => {return dt.target})
   const bonus = dataSalary.map(dt => {return dt.bonus})
   const absent = dataSalary.map(dt => {return dt.absent})

   const dataStaff = await Staff.find({})
   dataStaff.map( data =>{
      const idStaff = data._id
      const absent_val = data.absent
      const nameStaff = data.fullnameStaff
      const department = data.department
      const numWorkMonth_val = data.numberWorkMonth
      const date = new Date()
      const dateprocessed  = (new Intl.DateTimeFormat('en-US').format(date));
      
      const  totalSalary = work*numWorkMonth_val + bonus*(numWorkMonth_val-target) - absent*absent_val
      Salary.create({
         idStaff: idStaff,
         nameStaff: nameStaff,
         department: department,
         date: date,
         absent: absent_val,
         work: numWorkMonth_val,
         salary: totalSalary
      }).then(result =>{
         res.status(200).send({status: 'Create Salary Successfully!'})
      }).catch(err=>{
         res.status(200).send({status: 'No'})
      })
      
      const condition = {_id: data._id }
      const process = {
         absent: 0,
         numberWorkMonth: 9
      }

      Staff.updateOne( condition, process ).then(()=>{
         // res.status(200).send({status: 'Oke'})
      })

   })

})


   router.post('/dataForAppStaff',async(req,res ) =>{
      const dataSalary = await DataSalary.find({})
      // console.log(dataSalary);
      res.status(200).send(dataSalary)
   })

   router.post('/getDataSalaryByIdStaff', async(req, res ) =>{
      // console.log(req.body.idStaff);
      const SalaryStaff = await Salary.find({idStaff:  req.body.idStaff})
      // console.log(SalaryStaff);
      
      res.status(200).send(SalaryStaff)
   })

module.exports = router;