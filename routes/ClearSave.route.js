var express =  require('express')
var router = express.Router()
var Clear = require('../model/clear.model')
var ClearSave = require('../model/clearsave.model')
var Staff = require('../model/staff.model')
var Chat = require('../model/chat.model')

   router.post('/create', async(req,res)=>{
      // console.log(req.body);
      const work = req.body.work

      const dataClear =  await Clear.findOne({ _id: work._id })
      dataClear.idStaff.map(valueID =>{
         Staff.findOne({_id: valueID}).then(result =>{
            const idWork = result.idWork
            const idWorkFilter = idWork.filter(idWork =>{return idWork !== work._id})
                        
            const indexOfidWork = idWork.indexOf(work._id)
            
            // const timeEnd = result.timeEnd
            // timeEnd.splice(indexOfidWork,1)

            const time = result.time
            time.splice(indexOfidWork,1)
            
            const date = result.datework
            date.splice(indexOfidWork, 1)
            
            const condition ={ _id: valueID}
            const process = {
               idWork: idWorkFilter,
               time: time,
               // timeEnd: timeEnd,
               datework: date
            }
            
            Staff.updateOne( condition, process ).then(()=>{

            }).catch( err =>{

            })
         }).catch(err =>{

         })
      })
      
      await ClearSave.create({
         idWork: work._id,
         idStaff: work.idStaff,
         idUser: work.idUser,
         username: work.username,
         address: work.address,
         date: work.date,
         area: work.area,
         numRoom: work.numRoom,
         timeWork: work.timeWork,
         timeStart: work.timeStart,
         money: work.money
      }).then(data =>{
         Clear.findOne({_id: work._id  }).then(result =>{
            const condition = { _id: work._id}
            const process = {status: "Đã thanh toán"}
            Clear.updateOne(condition, process).then(()=>{

            })
         })
         Clear.deleteOne({_id: work._id}).then(result =>{
            
         }).catch(err=>{

         })
         Chat.deleteOne({idRoom: work._id}).then(result =>{
            console.log('Chat clear deleted');
         }).catch(err =>{
            console.log('Delete Clear Chat Failed');
         })
         res.status(200).send({status: "Successfull!"})
      }).catch(err =>{
         
      })
   })

   router.get('/dataSaveClear', async(req, res) =>{
      const dataSaveClear = await ClearSave.find({})
      res.status(200).send(dataSaveClear)
   })
   router.post('/data', async(req, res) =>{
      const dataClear  = await ClearSave.find({})
      res.status(200).send(dataClear)
   })

   router.post('/getNumWork', async(req,res) =>{
      const nowdate = new Date();
      console.log(nowdate.getUTCMonth()+1);
      const id = req.body.id
      const data = await ClearSave.find({idStaff: id})
      res.status(200).send(data)

   })

   router.post('/dataClearByMonth',async(req, res) =>{

      const dataMonth = await ClearSave.aggregate([
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
   router.post('/totalClear',async(req, res) =>{

      const dataMonth = await ClearSave.aggregate([
         { $match:
            {$expr: {
               $eq: [{ $month: "$date" }, Number(req.body.month)]
            }}
         },
         {   
            $group:{ 
               _id:  { $dateToString: { format: "%m", date: "$date" } },
               // time: { $first: "$date" },
               sum:  { $sum: "$money"}, 
            }
         }
      ])

      res.status(200).send(dataMonth)
      // console.log(dataMonth);


   })
   router.post('/totalClearWorkVal',async(req, res) =>{

      const m = req.body.month

      const dataMonth = await ClearSave.aggregate([
         {
            $match: {
               $expr: {
                  $eq: [{ $month: "$date" }, Number(req.body.month)]
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



module.exports = router