var express = require('express');
const auth = require('../middleware/auth');
var router = express.Router();
var Cooking = require('../model/cooking.model')

   router.get('/create',auth,async(req, res)=>{
      req.user.tokens = req.user.tokens.filter((token) => {
         return token.token == req.token
      })
      const user = req.user
      console.log(req.query);
      try {
         const cooking = new  Cooking({
            idUser: req.user._id,
            address: req.query.dtaddress,
            date: req.query.dtdate,
            dishList: req.query.dtdish,
            goMarket: req.query.dtMarket,
            time: req.query.dtTime,
            number: req.query.dtnumCustomer,
            money: req.query.dtMoney
         })
         await cooking.save()
         console.log('oke');
      }catch{
        console.log('aaaa');
      }
   })




module.exports = router;