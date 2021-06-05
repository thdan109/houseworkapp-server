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
   router.post('/data', async(req,res)=>{

      const dataWashing = await WashingSave.find({})
      res.status(200).send(dataWashing)

   })


   router.post('/dataWashingByMonth',async(req, res) =>{

      const dataMonth = await WashingSave.aggregate([
         { $match:
            {$expr: {
               $eq: [{ $month: "$dateTake" }, Number(req.body.month)]
            }}
         },
         {   
            $group:{ 
               _id:  { $dateToString: { format: "%Y-%m-%d", date: "$dateTake" } },
               time: { $first: "$dateTake" },
               sum:  { $sum: "$money"}, 
            }
         }
      ])

      res.status(200).send(dataMonth)
      // console.log(dataMonth);
   })
   router.post('/totalWashing',async(req, res) =>{

      const dataMonth = await WashingSave.aggregate([
         { $match:
            {$expr: {
               $eq: [{ $month: "$dateTake" }, Number(req.body.month)]
            }}
         },
         {   
            $group:{ 
               _id:  { $dateToString: { format: "%m", date: "$dateTake" } },
               // time: { $month: "$dateTake" },
               sum:  { $sum: "$money"} 
            }
         }
      ])

      res.status(200).send(dataMonth)
      // console.log(dataMonth);
   })
   router.post('/totalWashingWorkVal',async(req, res) =>{

      const m = req.body.month

      const dataMonth = await WashingSave.aggregate([
         {
            $match: {
               $expr: {
                  $eq: [{ $month: "$dateTake" }, Number(req.body.month)]
               }
            }
          },
          {
            $count: m
          }
      ])

      res.status(200).send(dataMonth)
      // console.log(dataMonth);


   })


   router.post('/getNumWork', async(req, res) =>{

      const id = req.body.id

      const data = await WashingSave.find({idStaff: id})

      console.log(data.length);
      res.status(200).send(data);

   })



module.exports = router