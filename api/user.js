const express = require("express");
const router = express.Router();
const axios = require("axios");

const User = require("../dbconnections/models/userModel");





router.get("/:user", (req, res, next) => {
  const id = req.params.user;
  User.findById({ _id: id })
    .select(' _id firstName lastName userPhoneNumber')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            user: doc,
            request: {
                type: 'GET',
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


router.put("/:user/update", (req, res, next) => {
  const id = req.params.user;
  const payload = req.body
  Ppmv.findByIdAndUpdate(id, payload)
    .then(doc => {
      res.status(200).json({
        message: "user updated successfully",

        user: doc,
        request: {
          type: "PUT",
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:user/delete", (req, res, next) => {
  const id = req.params.user;
  User.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'user deleted',
          request: {
              type: 'POST',
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;

