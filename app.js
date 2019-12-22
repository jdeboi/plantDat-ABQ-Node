// git push -f heroku working:master
// issue created with npm audit fix
// maybe just merge these together
const PORT = process.env.PORT || 5000



var express = require('express');
var app = express();

var createError = require('http-errors');

var path = require('path');
var cookieParser = require('cookie-parser');
var moment = require('moment');
var logger = require('morgan');
// var io = require('socket.io')(http);



var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// database
var mongoose = require('mongoose');
var mongoDB = process.env['MONGO_URI'];
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', indexRouter);
app.use('/about', indexRouter);
app.use('/resources', indexRouter);
app.use('/api', apiRouter);

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



app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

module.exports = app;
