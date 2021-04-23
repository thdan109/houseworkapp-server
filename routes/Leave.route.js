var express = require('express')

var router = express.Router()
var Leave = require('../model/leave.model')

router.post('/leaveOfStaffById', async(req,res) =>{
   const reason =  await Leave.find({idStaff: req.body.id })
   res.status(200).send(reason)
   // console.log(reason);
})    

router.post('/create', async(req, res )=>{
   console.log(req.body);
   const reason = await  Leave.create({
      idStaff: req.body.id,
      nameStaff: req.body.name,
      department: req.body.department,
      date: req.body.date,
      reason: req.body.reason
   })
   res.status(200).send({status: 'Successfully!'})
})
module.exports = router