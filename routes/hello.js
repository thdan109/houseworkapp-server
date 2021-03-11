var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req,res,next){
   // res.send('Hello22222')
   // const data1 = 'asdsdsad';
   res.json({data1:'10'})
   console.log('AAA');

})

module.exports = router;
