var express =  require('express')
var router = express.Router()
var Clear = require('../model/clear.model')
var ClearSave = require('../model/clearsave.model')
var Staff = require('../model/staff.model')

   router.post('/create', async(req,res)=>{
      // console.log(req.body);
      const work = req.body.work

      const dataClear =  await Clear.findOne({ _id: work._id })
      dataClear.idStaff.map(valueID =>{
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
         res.status(200).send({status: "Successfull!"})
      }).catch(err =>{
         
      })
   })

   router.get('/dataSaveClear', async(req, res) =>{
      const dataSaveClear = await ClearSave.find({})
      res.status(200).send(dataSaveClear)
   })

module.exports = router