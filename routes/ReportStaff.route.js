var express = require('express')
var router = express.Router()
var ReportStaff = require('../model/reportstaff.model')
var Staff = require('../model/staff.model');

router.post('/add',async(req,res)=>{
   // console.log(req.body)
   const createReport =   await ReportStaff.create({
      idWork :req.body.idWork,
      idStaff: req.body.idStaff,
      nameStaff: req.body.nameStaff,
      rating: req.body.rating,
      note: req.body.report
   })
   res.status(200).send(createReport)

   const data = await ReportStaff.find({idStaff: req.body.idStaff})
   // console.log(data);
   let num = 0;
   data.map(dt => {
     num = num +dt.rating
   })

   const rating_val =  num / Number(data.length)
//   console.log(rating_val);

   Staff.findOne({_id: req.body.idStaff}).then(res =>{
      
      const condition = {_id: req.body.idStaff}
      const process = { rating: rating_val }

      Staff.updateOne(condition, process).then(res =>{
         // console.log('aaaaaa');
      })
   })

})


router.post('/getDataRating', async(req, res) =>{
   const dataRate = await ReportStaff.find({idStaff: req.body.idStaff})
   res.status(200).send(dataRate)
})




router.get('/getData', async(req,res) =>{
   const data = await ReportStaff.find({})

   if ( data){
      res.status(200).send(data)
   }else{
      res.status(200).send({status: 'No'})
      console.log('Khong co du lieu');
   }
})
   
module.exports = router