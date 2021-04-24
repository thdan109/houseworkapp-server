var express =  require('express')
var router = express.Router()
var Cooking = require('../model/cooking.model')
var CookingSave = require('../model/cookingsave.model')

router.post('/create', async(req, res)=>{
   const work = req.body.work
   await CookingSave.create({
      idWork: work._id,
      idUSer: work.idUser,
      fullname: work.fullname,
      address: work.address,
      date: work.date,
      dishList: work.dishList,
      goMarket:work.goMarket,
      fruit: work.fruit,
      timeStart: work.timeStart,
      idStaff: work.idStaff,
      money: work.money
   }).then(result =>{
      Cooking.findOne({_id: work.id}).then(result =>{
         const condition ={ _id: work.id}
         const process = { status: "Đã thanh toán"}
         Cooking.updateOne(condition, process).then(()=>{
            // res.status(200).send({})
         })
         res.status(200).send({status: "Successfull!"})
      }).catch(err=>{
         console.log(err)
      })
   })
})

module.exports = router