var express = require('express')

var router = express.Router()

var FeedBack =require('../model/feedback.model')

router.post('/addFeedBack', async(req,res) =>{
   await FeedBack.create({
      
   }).then(result =>{

   }).catch( err =>{
      
   })
})


module.exports = router