var express = require('express')
var router = express.Router();
var auth = require("../middleware/auth")
var User = require('../model/customer.model')
var Cooking = require('../model/cooking.model')
const multer = require("multer");
var Clear = require("../model/clear.model")

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, "./public/images/users")
   },
   filename: function (req, file, cb) {
      //  console.log(file.originalname);
       cb(null, file.fieldname + '-' + Date.now() + file.originalname)
   }
 })

const uploadUser = multer({storage: storage});

//data user
router.get('/dataUser', function(req,res){
   User.find({}).then(result=>{
      res.json(result)
   })
})


//Register user
router.post('/register',async(req,res)=>{
   console.log((req.body));
   try{
      const user = new User({
         username: req.body.username,
         email: req.body.email,
         password: req.body.password,
         fullname: req.body.fullname,
         address: req.body.address,
         phone: req.body.phone,
         birthday: req.body.birthday,
         IDCard: req.body.idcard,
         sex: req.body.gender 
      })
      // console.log(user);
      await user.save()
      const token = await user.generateAuthToken()
      res.status(201).send({user,token})
    }catch(err){
      res.status(400).send(err)
    }

})




//Login user
   router.post('/login', async(req, res) => {
      const username = req.body.usernameCus;
      const password = req.body.passwordCus;
      //Login a registered user
      // console.log(username, password);
      try {
         //  const { username, password } = req.body
         tokenDevices = "tokenDevices"
         const user = await User.findByCredentials(username, password)
         if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
         }
         // console.log(user);
         // console.log(user.tokenDevices.indexOf(tokenDevices));
         // if(user.tokenDevices.indexOf(tokenDevices)===-1){
         //   user.tokenDevices.push(tokenDevices);
         // }

         const token = await user.generateAuthToken(tokenDevices)

         res.status(201).send({user, token})
         // res.status(200).send(user)
      } catch (error) { 
         res.status(400).send(error)
      }
   })

   router.get('/logout', auth, async(req,res)=>{
         // console.log("log");
         try {
             req.user.tokens = req.user.tokens.filter((token) => {
                 return token.token != req.token
             })
             await req.user.save()
             res.status(200).send("logout complete")
         } catch (error) {
             res.status(500).send("err")
         }
   })

   // router.post('/getDataById',  async(req, res) => {
   //    const id = req.body.id;
   //    await User.findOne({ _id: id })
   //    .then(data => {
   //       res.json(data)
   //    })
   // })

   router.get('/getDataById',auth, async(req, res)=>{
      // console.log(req.user);
      res.status(200).send(req.user)
   })

   router.get('/delUser/id=:idUser', (req,res) =>{   
      const id = req.params.idUser;
      // console.log(id);
      User.deleteOne({ _id: id}).then(data => {
         res.status(200).send({
            delUser: true
         })
      }).catch(err =>{
         res.status(200).send({
            delUser: false
         })
      })
   })


   router.post('/updateinfor', async(req,res)=>{
      console.log(req.body);
      User.findOne({ _id: req.body.id}).then(data =>{
         const condition = id
         const process = {
            fullname: req.body.fullname,
            phone: req.body.phone,
            email: req.body.email,
            sex: req.body.sex,
            address: req.body.address,
            birthday: req.body.calendar,
            idcard: req.body.idcard
         }
         User.updateOne( condition, process ).then(()=>{})
      })



   })

router.post('/imageUser',uploadUser.single('photo'),  async(req, res)=>{
   const id = req.body.id
   // console.log(id);
   // console.log(req.file.path);
   User.findOne({ _id: id }).then(data =>{
      const condition = {_id:id}
      const process = {
         avatar: req.file.path
      }
      User.updateOne( condition,  process ).then(()=> {

      }).catch(err =>{

      })
      res.status(200).send({ 
         avatar : req.file.path
       })
   }).catch(err =>{

   })

})

   router.get('/getOrder',auth, async(req,res)=>{
      req.user.tokens = req.user.tokens.filter((token) => {
         return token.token == req.token
      })
      const user = req.user
      const id = user._id
      const orderCooking = await Cooking.findOne({ idUser: id })
      // const newOrder = {...order._doc, Service: 'Cooking'}
      const orderClear = await Clear.findOne({idUSer: id})
      res.status(200).send({orderCooking, orderClear})

      
   })

module.exports = router;