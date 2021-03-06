var express = require('express')
var router = express.Router();
var auth = require("../middleware/auth")
var User = require('../model/customer.model')
var Cooking = require('../model/cooking.model')
const multer = require("multer");
var Clear = require("../model/clear.model")
var Washing = require('../model/washing.model')
var ClearSave = require('../model/clearsave.model')
var CookingSave = require('../model/cookingsave.model')
var WashingSave = require('../model/washingsave.model')
var bcrypt  = require('bcrypt');
const { default: Axios } = require('axios');


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
   // console.log((req.body));
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
// Changepass
router.post('/changepw', async(req, res) =>{

   const username = req.body.username
   const newpass = req.body.passnew
   const oldpass = req.body.passold
   const tokendv = req.body.tokendv

   // const hashpassword = await bcrypt.hash(newpass, 8)
   // console.log(username, newpass,oldpass);
   try{
      const user = await User.findByCredentials(username, oldpass)
      // console.log(user);
      if (user){
         user.password = newpass
         await user.save()
         const token = await user.generateAuthToken(tokendv)
         res.status(201).send({user, token})
      }else if (!user){
         return res.status(400).send({error: "Fail"})
      }

   }catch (error) {
      res.status(401).send(error)
   }


})



//Login user
   router.post('/login', async(req, res) => {
      const username = req.body.usernameCus;
      const password = req.body.passwordCus;
      const tokenDevice = req.body.tokenDevice
      // console.log(tokenDevice);
      //Login a registered user
      // console.log(username, password);
      try {
         // console.log(tokenDevice)
         const user = await User.findByCredentials(username, password)
         if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
         }
         // console.log(user.tokenDevices.indexOf(tokenDevices));
         // if(user.tokenDevices.indexOf(tokenDevices)===-1){
         //   user.tokenDevices.push(tokenDevices);
         // }
         const token = await user.generateAuthToken(tokenDevice)
         res.status(201).send({user, token})
      } catch (error) { 
         res.status(201).send(error)
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
      const orderCooking = await Cooking.find({$and: [{idUser: id}, {status: {$ne: "Ch??? thu ti???n"}}]}).populate({path: 'reqStaff', select: 'fullnameStaff'})
      // const newOrder = {...order._doc, Service: 'Cooking'}
      const orderWashing = await Washing.find({$and: [{idUser: id}, {status: {$ne: "Ch??? thu ti???n"}}]})
      const orderClear = await Clear.find({$and: [{idUser: id}, {status: {$ne: "Ch??? thu ti???n"}}]}).populate({path: 'reqStaff', select: 'fullnameStaff'})
      res.status(200).send({orderCooking, orderClear, orderWashing})
      // console.log(orderWashing);
      // console.log(orderWashing);
      
      
   })

   router.get('/getOrderSave',auth, async(req,res)=>{
      req.user.tokens = req.user.tokens.filter((token) => {
         return token.token == req.token
      })
      const user = req.user
      const id = user._id
      const orderCookingSave = await CookingSave.find({idUser: id})
      // const newOrder = {...order._doc, Service: 'Cooking'}
      const orderWashingSave = await WashingSave.find({idUser: id})
      const orderClearSave = await ClearSave.find({idUser: id})
      res.status(200).send({orderCookingSave, orderClearSave, orderWashingSave})
      // console.log(orderWashing);
      // console.log(orderCooking);
      // console.log(orderClear);
   })

   router.post('/pushNotifiClear',async(req,res) =>{
      // console.log(req.body.id);
      const id = req.body.id
      const idWork = req.body.idWork
      const userTB = await User.findOne({_id: id})
      const dataClear = await Clear.findOne({_id: idWork})
      // console.log(dataClear);
      for (var i of userTB.tokens){
         sendPushNotificationUser(i.tokenDevices, dataClear.date.toDateString() )
      }

      // Clear.findOne({_id: idWork}).then(res =>{
      //    const condition = { _id: idWork }
      //    const process = { status: "??ang ch??? ph???n h???i" }
      //    Clear.updateOne(condition, process)
         
      // })
      if (dataClear){
         const condition = { _id: idWork }
         const process = { status: "??ang ch??? ph???n h???i" }
         await Clear.updateOne(condition, process)
         res.status(200).send({status: "Oke"})
      }else{
         res.status(400).send({status: "Fail"})
      }
     

   })
   router.post('/pushNotifiCooking',async(req,res) =>{
      // console.log(req.body.id);
      const id = req.body.id
      const idWork = req.body.idWork
      const userTB = await User.findOne({_id: id})
      const dataCooking = await Cooking.findOne({_id: idWork})
      // console.log(dataClear);
      for (var i of userTB.tokens){
         sendPushNotificationUser(i.tokenDevices, dataCooking.date.toDateString() )
      }

      // Clear.findOne({_id: idWork}).then(res =>{
      //    const condition = { _id: idWork }
      //    const process = { status: "??ang ch??? ph???n h???i" }
      //    Clear.updateOne(condition, process)
         
      // })
      if (dataCooking){
         const condition = { _id: idWork }
         const process = { status: "??ang ch??? ph???n h???i" }
         await Cooking.updateOne(condition, process)
         res.status(200).send({status: "Oke"})
      }else{
         res.status(400).send({status: "Fail"})
      }
     

   })



   async function sendPushNotificationUser(expoPushToken,date) {
      var text = "Nh??n vi??n hi???n ???? b???n. B???n c?? th??? h???y ho???c v???n ti???p t???c c??ng vi???c v???i nh??n vi??n kh??c!"
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: date + "\fNh??n vi??n b???n!",
        body: text,
        data: { data: 'goes here' },
      };
      await Axios.post('https://exp.host/--/api/v2/push/send', JSON.stringify(message), {
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
       
      }).then(()=>{

      } ).catch(()=>{

      });
    }

module.exports = router;