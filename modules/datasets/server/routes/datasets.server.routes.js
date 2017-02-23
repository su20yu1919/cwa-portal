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

var pkgcloud = require('pkgcloud');
var pkgcloudStorage = require('multer-storage-pkgcloud');

var config = {
  provider: 'openstack',
  useServiceCatalog: true,
  useInternal: false,
  keystoneAuthVersion: 'v3',
  authUrl: 'https://identity.open.softlayer.com',
  tenantId: 'df3d1c7671eb4bd5bfb7fb9bd5b99329',    //projectId from credentials
  domainId: 'dbcedc6cd3ee4870ab6e763b3c45892f',
  username: 'admin_5ab847bf860f65620161f50ca604971e7d742d50',
  password: 'w=Jptk3?2~CoSo=E',
  region: 'dallas'   //dallas or london region
};

var storageClient = pkgcloud.storage.createClient(config);

storageClient.auth(function(err) {
  if (err) {
    console.error(err);
  }
  else {
    
  }
});

var storage = pkgcloudStorage({
  client: storageClient,
  destination: function (req, file, cb) {
    cb(null, {
      container: 'erie-hack',
      remote: file.fieldname + '-' + Date.now()
    });
  }
});

// var storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './uploads/');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.fieldname + '-' + Date.now());
//   }
// });

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
      console.log(req.files.files);
      console.log('upload successful');
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
        res.setHeader('Content-disposition', 'attachment; filename=' + req.query.filename);
        console.log(file);
        result = file.filename;
        storageClient.download({
          container: 'erie-hack',
          remote: result
        }).pipe(res);
        // res.download(url, req.query.filename);
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

        // Find and delete file link
        File.findOne({
          "originalname": req.query.filename
        }).remove().exec(function (err){
          if(err){
            console.log(err);
          }
        });

        //remove the file from service
        storageClient.removeFile('erie-hack', result, function(err){
          if (err){
            console.log(err);
          }
          console.log('successfully deleted');
        })
      }
    });

  });
  
  
  // Finish by binding the Dataset middleware
  app.param('datasetId', datasets.datasetByID);
};
