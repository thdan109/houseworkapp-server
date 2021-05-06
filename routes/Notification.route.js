var express = require('express')
var router = express.Router()
var Notification = require('../model/notification.model')


router.post('/getData', async(req, res) =>{
   const id = req.body.idUser
   const data = await Notification.find({ idUser: id })
   res.status(200).send(data)
})




module.exports = router