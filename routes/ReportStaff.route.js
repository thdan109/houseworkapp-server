var express = require('express')
var router = express.Router()
var ReportStaff = require('../model/reportstaff.model')

router.post('/add',async(req,res)=>{
   console.log(req.body)
   const createReport =   await ReportStaff.create({
      idWork :req.body.idWork,
      idStaff: req.body.idStaff,
      note: req.body.report
   })
   res.status(200).send(createReport)

} )


   
module.exports = router