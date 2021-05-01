var express = require('express')

var router = express.Router()

var FeedBack =require('../model/feedback.model')

router.post('/addFeedBack', async(req,res) =>{
   await FeedBack.create({
      idWork: req.body.idWork,
      idUser: req.body.idUser,
      nameUser: req.body.nameUser,
      rate: req.body.number,
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