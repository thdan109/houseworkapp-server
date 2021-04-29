var express = require('express')
var router = express.Router();

var Service = require('../model/service.model')

//data Serviec

router.get('/dataService', async(req,res) =>{
   await Service.find({}).then(data=>{
      res.json(data)
   })
})

router.get('/dataServiceByID/id=:id', async(req,res) =>{
   // console.log(req.params.id)
   const data = await Service.findOne({ _id: req.params.id  })
   res.send(data)
}) 
//add service

router.post('/addService', function(req,res){      
   const a = req.body.price.map(dt =>{
      return  dt.value
   })
   a.push(req.body.dataSend.value) 
   // console.log(a);
   Service.create({
      type: req.body.dataSend.type,
      nameService: req.body.dataSend.nameService,
      descriptionService: req.body.dataSend.discription,
      prince: a
   }).then(data=>{
      res.status(200).send({st: 'Oke'})
   }).catch(err =>{

   })
})

router.post('/updataService', async(req,res) =>{
   // console.log(req.body);
   const object = req.body.data
   const prince = []
   for (const property in object) {
      // console.log(`${property}: ${object[property]}`);
      if ( (property !== 'nameService') && (property !== 'description') ){
         prince.push(object[property])
         // console.log(`${object[property]}`);
         
      }
   }
   // console.log(prince)
   const id = req.body.id;
   console.log(req.body.id);
   Service.findOne({ _id: id}).then(data =>{
      const condition = {_id: id}
      const process = {
         nameService: req.body.data.nameService,
         descriptionService: req.body.data.description,
         prince: prince
      }
      Service.updateOne( condition, process ).then(()=>{
         res.status(200).send({Update: 'Oke'})
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