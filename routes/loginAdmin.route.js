var express = require('express');
const ADList = require('../model/admin.model');

var router = express.Router();
router.post('/',function(req,res){
   const username = req.body.username;
   const password = req.body.password;
   
   ADList.findOne({username: username}).then(data => {
      if (password === data.password && password!==''){
         res.status(200).send({
            id: data._id,
            name: data.username,
            position: data.position
         })
      }else{
         res.status(200).send('sai')
      }
   }).catch(error =>{
      res.status(200).send('Ko ton tai');
   })

})

module.exports = router;