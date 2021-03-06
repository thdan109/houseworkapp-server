var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); 
var app = express();
var cors = require('cors');
var dotenv = require('dotenv').config()





const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DB')
.then(()=> console.log("Connnectttt")) 
.catch(err => console.log("err"+err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var helloRouter = require('./routes/hello');
var loginAdminRouters = require('./routes/loginAdmin.route');
var StaffRoute = require('./routes/Staff.route')
var UserRoute = require('./routes/Customer.route')
var ServiceRoute = require('./routes/Service.route')
var CookingRoute = require('./routes/Cooking.route')
var ClearRoute = require('./routes/Clear.route')
var WashingRoute = require('./routes/Washing.route')
var LeaveRoute = require('./routes/Leave.route')
var ClearSaveRoute = require('./routes/ClearSave.route')
var WashingSaveRoute = require('./routes/WashingSave.route')
var CookingSaveRoute = require('./routes/CookingSave.route')
var ReportStaffRoute = require('./routes/ReportStaff.route')
var FeedBackRoute = require('./routes/FeedBack.route')
var SalaryRoute = require('./routes/Salary.route')
var ChatRoute = require('./routes/Chat.route')
var NotificationRoute = require('./routes/Notification.route')
var VoucherRoute = require('./routes/Voucher.route');
const Voucher = require('./model/voucher.model');
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/hello', helloRouter);
app.use('/admin', loginAdminRouters);
app.use('/staff', StaffRoute);
app.use('/user', UserRoute);
app.use('/service', ServiceRoute)
app.use('/cooking',CookingRoute)
app.use('/clear', ClearRoute)
app.use('/washing', WashingRoute)
app.use('/leave', LeaveRoute)
app.use('/clearsave', ClearSaveRoute)
app.use('/washingsave', WashingSaveRoute)
app.use('/cookingsave', CookingSaveRoute)
app.use('/reportstaff', ReportStaffRoute)
app.use('/feedback', FeedBackRoute)
app.use('/salary', SalaryRoute)
app.use('/chat', ChatRoute)
app.use('/notifi', NotificationRoute)
app.use('/voucher',VoucherRoute)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
