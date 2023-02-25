const express = require("express")
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require("cors")

const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const apptRouter = require('./routes/appointment');

const app = express();
const {
  connectDB
} = require("./config/db")
connectDB()

app.use(cors({
  origin:"http://localhost:3000"
 })) 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app.use("/api/appointment",apptRouter)
app.use("/api/users",usersRouter)
app.use("/api/",indexRouter)

app.use(function(req, res, next) {
  console.log("here")
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // send the error page
    res.status(err.status || 500);
    res.send(err);
  })
module.exports = app;
