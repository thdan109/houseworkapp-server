var express = require('express')
var router = express.Router()
var Salary = require('../model/salary.model')
var DataSalary = require('../model/dataSalary.model')

router.get('/getDataSalary', async(req,res) =>{
   const data = await DataSalary.find({})

   if (data !== null ){
      res.status(200).send(data)
      console.log(data);
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




module.exports = router;