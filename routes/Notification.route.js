var express = require('express')
var router = express.Router()
var Notification = require('../model/notification.model')
var NotificationStaff = require('../model/notificationstaff.model')


router.post('/getData', async(req, res) =>{
   const id = req.body.idUser
   const data = await Notification.find({ idUser: id }).sort([['date',-1]])
   res.status(200).send(data)
})
router.post('/getDataStaff', async(req, res) =>{
   const id = req.body.idStaff
   const data = await NotificationStaff.find({ idStaff: id }).sort([['date',-1]])
   res.status(200).send(data)
})



module.exports = router