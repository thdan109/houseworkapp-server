const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/application')
.then(()=> console.log("Connected"))
.catch(err => console.log("error: "+ err))

module.exports = mongoose;

// const mongoose = require('mongoose');
// const urlDB = process.env.URL_MONGODB;
// mongoose.connect(urlDB)
// .then(() => console.log("mongoDB connected"))
// // .catch(err => console.log('err: ' + err))

// module.export = mongoose