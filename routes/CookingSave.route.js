var express =  require('express')
var router = express.Router()
var Cooking = require('../model/cooking.model')
var CookingSave = require('../model/cookingsave.model')
var Staff = require('../model/staff.model')

   router.post('/create', async(req, res)=>{
      const work = req.body.work

      const dataCooking =  await Cooking.findOne({ _id: work._id })
      dataCooking.idStaff.map(valueID =>{
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
            const condition ={ _id: work._id}
            const process = { status: "Đã thanh toán"}
            Cooking.updateOne(condition, process).then(()=>{
               // res.status(200).send({})
            })
            Cooking.deleteOne({_id: work._id}).then(result =>{

            }).catch(err =>{
               
            })
            Chat.deleteOne({idRoom: work._id}).then(result =>{
               console.log('Chat cooking deleted');
            }).catch(err =>{
               console.log('Delete cooking Chat Failed');
            })
            res.status(200).send({status: "Successfull!"})
         }).catch(err=>{
            console.log(err)
         })
      })
   })

   router.get('/dataSaveCooking', async(req, res) =>{
      const savecook =  await CookingSave.find({})
      res.status(200).send(savecook)
   })

   router.post('/data', async(req, res) =>{
      const dataCooking = await CookingSave.find({})
      res.status(200).send(dataCooking)
   })



   router.post('/dataClearByMonth',async(req, res) =>{

      const dataMonth = await CookingSave.aggregate([
         { $match:
            {$expr: {
               $eq: [{ $month: "$date" }, Number(req.body.month)]
            }}
         },
         {   
            $group:{ 
               _id:  { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
               time: { $first: "$date" },
               sum:  { $sum: "$money"}, 
            }
         }
      ])

      res.status(200).send(dataMonth)
      // console.log(dataMonth);


   })


module.exports = router