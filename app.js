const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
const winston = require('winston');
const MongoDB = require('winston-mongodb').MongoDB;
const paginate = require('express-paginate');


require('dotenv').config();
const cookieParser = require('cookie-parser');

const middlewares = require('./auth/middlewares');

const authAdmin = require('./auth/admin.index');

const routePath = require('./routes/routePath');

// this is your stuff
const ppmv = require('./api/user');



const { notFound, errorHandler} = require('./middlewares')

const app = express();

app.use(volleyball); //Logs every single incoming request

app.use(paginate.middleware(10, 50));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

const db = process.env.LOG_DB
const host = process.env.LOG_HOST
const username = process.env.LOG_USERNAME
const password = process.env.LOG_PASSWORD






app.use(express.json());

app.use(middlewares.checkTokenSetUser);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.get('/', (req, res) => {
  res.json({
    message: 'cms auth headers! 🌈✨🦄',
    user: req.user,
  });
});



// to be authenticated with middleware.isLoggedIn
// prouct api route
// cutomer api
// ppmv api routes
app.use(routePath.ppmvPath, middleware.isLoggedIn, ppmv);
app.use(routePath.authAdminPath, authAdmin);// General Login spots

//open routes??????????????????????????

// catch 404 and forward to error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
