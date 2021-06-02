var express = require('express')

var router = express.Router()

var FeedBack =require('../model/feedback.model')

router.post('/addFeedBack', async(req,res) =>{
   await FeedBack.create({
      idWork: req.body.idWork,
      idUser: req.body.idUser,
      nameUser: req.body.nameUser,
      rate: req.body.number,
      type: req.body.type,
      contentfeedback: req.body.feedback
   }).then(result =>{
      res.status(200).send({status: 'Oke'})
   }).catch( err =>{
      
   })

})

router.get('/getData', async(req,res)=>{
   const data = await FeedBack.find({})
   res.status(200).send(data)
   // console.log(data);
})


router.post('/getDataFeedBackForApp',async(req, res) =>{

   // const data = await FeedBack.find({})
   const dataClear = await FeedBack.find({type: 'clear'})
   let num = 0;
   dataClear.map(dt  =>{
      num = num + dt.rate
   })
   const rate_valclear = num / dataClear.length
   // res.status(200).send({dataClear: dataClear, rate_val: rate_val})
   
   const dataCooking = await FeedBack.find({type: 'cooking'})
   let num1 = 0;
   dataCooking.map(dt  =>{
      num1 = num1 + dt.rate
   })
   const rate_valcooking = num1 / dataCooking.length

   const dataWashing = await FeedBack.find({type: 'washing'})
   let num2 = 0;
   dataWashing.map(dt  =>{
      num2 = num2 + dt.rate
   })
   const rate_valwashing = num2 / dataWashing.length

   res.status(200).send({
      dataWashing: dataWashing, 
      rate_valwashing: rate_valwashing,
      dataClear: dataClear, 
      rate_valclear: rate_valclear, 
      dataCooking: dataCooking, 
      rate_valcooking: rate_valcooking 
   })
   // console.log(rate_val);
 


})

router.post('/checkFB', async(req,res) =>{
   const idUser = req.body.idUser

   const data = await FeedBack.findOne({idUser: idUser})
   if (data){
      res.status(200).send({status: 'Yes'})
      // console.log('Yes');
   }else{
      res.status(200).send({status: 'No'})
      // console.log('No');
   }
})


module.exports = router