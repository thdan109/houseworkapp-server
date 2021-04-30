var express = require('express')
var router = express.Router()
var Washing = require('../model/washing.model')
var WashingSave = require('../model/washingsave.model')
var Staff = require('../model/staff.model')


   router.post('/create', async(req,res)=>{
      const work = req.body.work
      const dataWashing =  await Washing.findOne({ _id: work._id })
      dataWashing.idStaff.map(valueID =>{
         Staff.findOne({_id: valueID}).then(result =>{
            const idWork = result.idWork
            const idWorkFilter = idWork.filter(idWork =>{return idWork !== work._id})
                        
            const indexOfidWork = idWork.indexOf(work._id)
            
            const time = result.time
            time.splice(indexOfidWork,1)
            
            const date = result.datework
            date.splice(indexOfidWork, 1)
            
            const condition ={ _id: valueID}
            const process = {
               idWork: idWorkFilter,
               time: time,
               datework: date
            }
            
            Staff.updateOne( condition, process ).then(()=>{

            }).catch( err =>{

            })
         }).catch(err =>{

         })
      })
      await WashingSave.create({
         idWork: work._id,
         idUser: work.idUser,
         fullname: work.fullname,
         address: work.address,
         dateSend: work.dateSend,
         dateTake: work.dateTake,
         timeSend: work.timeSend,
         timeTake: work.timeTake,
         money: work.money
      }).then(result =>{
         Washing.findOne({_id: work._id}).then(result=>{
            const condition = { _id: work._id}
            const process = { status: "Đã thanh toán"}
            Washing.updateOne(condition, process).then(()=>{
            })
         })
         Washing.deleteOne({_id: work._id}).then(result =>{
            
         })
         Chat.deleteOne({idRoom: work._id}).then(result =>{
            console.log('Chat wash deleted');
         }).catch(err =>{
            console.log('Delete wash Chat Failed');
         })
         res.status(200).send({status: "Successfull!"})
      }).catch(err =>{
         console.log(err);
      })

   })

   router.get('/dataSaveWasing', async(req, res)=>{
      const dataSave = await WashingSave.find({})
      res.status(200).send(dataSave)
   })

module.exports = router