var express = require('express')
var router = express.Router();

var Service = require('../model/service.model')

//data Serviec

router.get('/dataService', function(req,res){
   Service.find({}).then(data=>{
      res.json(data)
   })
})
// router.get('/dataServiceByID', function(req,res){
//    Service.find({ _id: req.params  }).then(data=>{
//       res.json(data)
//    })
// })
//add service

router.post('/addService', function(req,res){
      // console.log(req.body);
   Service.create({
      nameService: req.body.nameService,
      descriptionService: req.body.descriptionService,
      prince: req.body.prince
   }).then(res=>{

   }).catch(err =>{

   })
})

router.post('/updataService', function(req,res){
   const postdataService = req.body;
   const id = req.body._id;
   Service.findOne({ _id: id}).then(data =>{
      const condition = id
      const process = {
         nameService: req.body.nameService,
         descriptionService: req.body.descriptionService,
         prince: req.body.prince
      }
      Service.updateOne( condition, process ).then(()=>{
         
      })
   })
})

router.get('/delService/id=:idService',async(req,res)=>{
   // console.log(req.params);
   const idService = req.params.idService
   Service.deleteOne({ _id: idService }).then(res =>{
      
   }).catch(err =>{

   })
})



module.exports = router