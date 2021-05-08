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


router.post('/getVoucherForCustomer', async(req, res ) =>{

})


module.exports = router