'use strict';

/**
 * Module dependencies
 */
var datasetsPolicy = require('../policies/datasets.server.policy'),
  datasets = require('../controllers/datasets.server.controller'),
  multer = require('multer'),
  mongoose = require('mongoose'),
  File = mongoose.model('File');

var fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({
  storage: storage
}).fields([{
  name: 'files', maxCount: 20
},
  {
    name: 'documentations', maxCount: 20
  }]);


module.exports = function (app) {
  
  // Datasets Routes
  
  app.route('/api/datasets').all(datasetsPolicy.isAllowed)
    .get(datasets.list)
    .post(datasets.create);
  
  
  app.route('/api/datasets/:datasetId').all(datasetsPolicy.isAllowed)
    .get(datasets.read)
    .put(datasets.update)
    .delete(datasets.delete);
  //datasetsPolicy.isAllowed
  
  app.post('/api/uploads', function (req, res) {
    upload(req, res, function (err) {
      if (err) {
        return res.end('Error uploading file.');
      }
      res.json(req.files);
      for (var j = 0, length = req.files.files.length; j < length; j++) {
        datasets.create_file(req.files.files[j]);
      }
    });
    
    
  });
  
  // This is where you download the file
  app.get('/api/downloads', function (req, res) {
    var result;
    File.findOne({
      "originalname": req.query.filename
    }).select('filename').exec(function (err, file) {
      if (err) {
        console.log('Error Finding File Specified');
      } else if (!file) {
        console.log("Can't find the file");
      } else {
        console.log(file);
        result = file.filename;
        var url = "./uploads/" + result;
        res.download(url, req.query.filename);
      }
    });
    

  });

  // This is where you delete the file
  app.delete('/api/delete_file', function (req, res) {
    var result;
    console.log(req.query.filename);
    //Find and delete file
    File.findOne({
      "originalname": req.query.filename
    }).select('filename').exec(function (err, file) {
      if (err) {
        console.log('Error Finding File Specified');
      } else if (!file) {
        console.log("Can't find the file");
      } else {
        
        console.log(file);
        result = file.filename;
        var url = "./uploads/" + result;

        // Find and delete file link
        File.findOne({
          "originalname": req.query.filename
        }).remove().exec(function (err){
          if(err){
            console.log(err);
          }
        });

        //use file system to unlink the file
        fs.unlink(url, function(err){
          if(err) return console.log(err);
          console.log('file deleted successfully');
        });
      }
    });

  });
  
  
  // Finish by binding the Dataset middleware
  app.param('datasetId', datasets.datasetByID);
};
