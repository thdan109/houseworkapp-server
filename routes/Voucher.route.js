var express = require('express')
var router = express.Router()
var Voucher = require('../model/voucher.model')



router.get('/dataVoucherAdmin', async(req, res )=>{
   const data = await Voucher.find({})
   res.status(200).send(data)
})

router.post('/addVoucher', async(req, res) =>{
   console.log(req.body);

   await  Voucher.create({
      nameVoucher: req.body.nameVoucher,
      codeVoucher: req.body.codeVoucher,
      prince: req.body.prince
   }).then( res =>{  
      // console.log(res);
   }).catch(err =>{
      // console.log(err);
   })

})

router.post('/showVoucherById', async(req,res) =>{
   const data =  await Voucher.findOne({_id: req.body.id})
   res.status(200).send(data)
})

router.post('/getVoucherById', async(req, res ) =>{
   // console.log(req.body.idUser);
   const data = await Voucher.find({ idUser : {$ne: req.body.idUser} })
   res.status(200).send(data)
   // console.log(data);

})
router.post('/getVoucherByIdClear', async(req, res ) =>{
   // console.log(req.body.idUser);
   const data = await Voucher.find({ idUser : {$ne: req.body.idUser} })
   res.status(200).send(data)
   // console.log(data);

})
router.post('/getVoucherByIdWashing', async(req, res ) =>{
   // console.log(req.body.idUser);
   const data = await Voucher.find({ idUser : {$ne: req.body.idUser} })
   res.status(200).send(data)
   // console.log(data);
})

router.post('/getVoucherByIdCooking', async(req, res ) =>{
   // console.log(req.body.idUser);
   const data = await Voucher.find({ idUser : {$ne: req.body.idUser} })
   res.status(200).send(data)
   // console.log(data);
})

module.exports = router