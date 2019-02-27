const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require("axios");

const User = require("../dbconnections/models/userModel");
 // increase speed of username query, give direct link to query
const router = express.Router();

const login = Joi.object().keys({
  userPhoneNumber: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(11).max(30).required(),
  password: Joi.string().trim().min(7).required()
});



// passive aggressive middlewares? lool

function createTokenSendResponse(user, res, next) { // create token with token respnsone 
  const payload = {...user};
  jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: '1d'
  },(err, token) => {
    if (err) {
      code422(res, next); // unable to login error
    } else {
      res.json({
        token
      });
    }
  });
}


// any route in here is pre-handled with /auth/admin/

router.get('/', (req,res) => {
  res.json({
    message: 'Admin 🔐'
  })
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// error code for login
function code422(res, next) {
  res.status(422); //UNPROCESSABLE ENTITY
  const error = new Error('Unable to Login'); //restrict hint of failed attempt solutions
  next(error); //forwards to error handler func
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/login', (req, res, next) => {
  const result = Joi.validate(req.body, login);
  if (result.error === null) {
    User.findOne({
      userPhoneNumber: req.body.userPhoneNumber,
    }).then( user => {
      console.log('this is user', user)
       if (user) {
        let tokenData;    
          // compare passords
          bcrypt
          .compare(req.body.password, user.password)
          .then((result) => {
          if (result) { // if result is true, proper passwords
            createTokenSendResponse(tokenData, res, next);
          } else {
            code422(res, next);
          }
        });   

       } else {
         code422(res, next);
       }
    });
  } else {
    code422(res, next);
  }
});


router.post("/signup", (req, res, next) => {
  const authHeader = req.get('authorization');
  const payload =  req.body

  payload.modifiedBy  = req.user;
  var post = new User(payload);
 
   // res.redirect(307, 'https://creative-wallet-api.herokuapp.com/users', { headers: { Authorization: `${authHeader}` } } + req.path);
   

   post
    .save()
    .then(result => {
      console.log(result);
      axios.post('https://naijalottery-wallet-api.herokuapp.com/admin/auth/account-create/createAccount', result 
    ).then(function (response) {
      console.log(response);
  })
  .catch(function(error) {
      console.log(error);
  })   
      res.status(201).json({
        message: "Users has been created successfully",
        createdPpmv: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
    
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;