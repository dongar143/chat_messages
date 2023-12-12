var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var Message = require('./message');
var VerifyToken = require('./VerifyToken');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
// var User = require('../user/User');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file

const axios = require("axios");
var Message = require('../auth/message');

var mongoose = require('mongoose'); 
const XLSX = require('xlsx');
const fs = require('fs');
mongoose.Promise = global.Promise;

router.post('/sendMessage',VerifyToken, function(req, res) {

  Message.create({
    message : req.body.message,
    sender : req.userId,
    receiver : req.body.receiver
  }, 
  function (err, message) {
    if (err) return res.status(500).send("There was a problem registering the user`.");

    res.status(200).send({ message:"Message send Successfully" });
  });

});



router.get('/getMessage', VerifyToken, function(req, res, next) {

  Message.find({ $or: [
    { sender: req.userId },
    { receiver: req.userId }
  ]}, function (err, user) {
    console.log("err",typeof mongoose.Types.ObjectId(req.userId) );
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });

});

router.get('/download-excel', async (req, res) => {
  try {
    // Query the database to retrieve data
    const data = await Message.find({}, { _id: 0, __v: 0 });

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create a workbook and add the worksheet to it
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

    // Write the workbook to a file
    const excelFileName = 'data.xlsx';
    XLSX.writeFile(wb, excelFileName);

    // Send the file as a response
    res.download(excelFileName, excelFileName, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
      // Delete the file after sending
      fs.unlinkSync(excelFileName);
      console.log("s2");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;