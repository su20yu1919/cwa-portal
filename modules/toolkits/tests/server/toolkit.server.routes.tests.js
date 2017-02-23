'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Toolkit = mongoose.model('Toolkit'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  toolkit;

/**
 * Toolkit routes tests
 */
describe('Toolkit CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Toolkit
    user.save(function () {
      toolkit = {
        name: 'Toolkit name'
      };

      done();
    });
  });

  it('should be able to save a Toolkit if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Toolkit
        agent.post('/api/toolkits')
          .send(toolkit)
          .expect(200)
          .end(function (toolkitSaveErr, toolkitSaveRes) {
            // Handle Toolkit save error
            if (toolkitSaveErr) {
              return done(toolkitSaveErr);
            }

            // Get a list of Toolkits
            agent.get('/api/toolkits')
              .end(function (toolkitsGetErr, toolkitsGetRes) {
                // Handle Toolkits save error
                if (toolkitsGetErr) {
                  return done(toolkitsGetErr);
                }

                // Get Toolkits list
                var toolkits = toolkitsGetRes.body;

                // Set assertions
                (toolkits[0].user._id).should.equal(userId);
                (toolkits[0].name).should.match('Toolkit name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Toolkit if not logged in', function (done) {
    agent.post('/api/toolkits')
      .send(toolkit)
      .expect(403)
      .end(function (toolkitSaveErr, toolkitSaveRes) {
        // Call the assertion callback
        done(toolkitSaveErr);
      });
  });

  it('should not be able to save an Toolkit if no name is provided', function (done) {
    // Invalidate name field
    toolkit.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Toolkit
        agent.post('/api/toolkits')
          .send(toolkit)
          .expect(400)
          .end(function (toolkitSaveErr, toolkitSaveRes) {
            // Set message assertion
            (toolkitSaveRes.body.message).should.match('Please fill Toolkit name');

            // Handle Toolkit save error
            done(toolkitSaveErr);
          });
      });
  });

  it('should be able to update an Toolkit if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Toolkit
        agent.post('/api/toolkits')
          .send(toolkit)
          .expect(200)
          .end(function (toolkitSaveErr, toolkitSaveRes) {
            // Handle Toolkit save error
            if (toolkitSaveErr) {
              return done(toolkitSaveErr);
            }

            // Update Toolkit name
            toolkit.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Toolkit
            agent.put('/api/toolkits/' + toolkitSaveRes.body._id)
              .send(toolkit)
              .expect(200)
              .end(function (toolkitUpdateErr, toolkitUpdateRes) {
                // Handle Toolkit update error
                if (toolkitUpdateErr) {
                  return done(toolkitUpdateErr);
                }

                // Set assertions
                (toolkitUpdateRes.body._id).should.equal(toolkitSaveRes.body._id);
                (toolkitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Toolkits if not signed in', function (done) {
    // Create new Toolkit model instance
    var toolkitObj = new Toolkit(toolkit);

    // Save the toolkit
    toolkitObj.save(function () {
      // Request Toolkits
      request(app).get('/api/toolkits')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Toolkit if not signed in', function (done) {
    // Create new Toolkit model instance
    var toolkitObj = new Toolkit(toolkit);

    // Save the Toolkit
    toolkitObj.save(function () {
      request(app).get('/api/toolkits/' + toolkitObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', toolkit.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Toolkit with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/toolkits/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Toolkit is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Toolkit which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Toolkit
    request(app).get('/api/toolkits/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Toolkit with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Toolkit if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Toolkit
        agent.post('/api/toolkits')
          .send(toolkit)
          .expect(200)
          .end(function (toolkitSaveErr, toolkitSaveRes) {
            // Handle Toolkit save error
            if (toolkitSaveErr) {
              return done(toolkitSaveErr);
            }

            // Delete an existing Toolkit
            agent.delete('/api/toolkits/' + toolkitSaveRes.body._id)
              .send(toolkit)
              .expect(200)
              .end(function (toolkitDeleteErr, toolkitDeleteRes) {
                // Handle toolkit error error
                if (toolkitDeleteErr) {
                  return done(toolkitDeleteErr);
                }

                // Set assertions
                (toolkitDeleteRes.body._id).should.equal(toolkitSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Toolkit if not signed in', function (done) {
    // Set Toolkit user
    toolkit.user = user;

    // Create new Toolkit model instance
    var toolkitObj = new Toolkit(toolkit);

    // Save the Toolkit
    toolkitObj.save(function () {
      // Try deleting Toolkit
      request(app).delete('/api/toolkits/' + toolkitObj._id)
        .expect(403)
        .end(function (toolkitDeleteErr, toolkitDeleteRes) {
          // Set message assertion
          (toolkitDeleteRes.body.message).should.match('User is not authorized');

          // Handle Toolkit error error
          done(toolkitDeleteErr);
        });

    });
  });

  it('should be able to get a single Toolkit that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Toolkit
          agent.post('/api/toolkits')
            .send(toolkit)
            .expect(200)
            .end(function (toolkitSaveErr, toolkitSaveRes) {
              // Handle Toolkit save error
              if (toolkitSaveErr) {
                return done(toolkitSaveErr);
              }

              // Set assertions on new Toolkit
              (toolkitSaveRes.body.name).should.equal(toolkit.name);
              should.exist(toolkitSaveRes.body.user);
              should.equal(toolkitSaveRes.body.user._id, orphanId);

              // force the Toolkit to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Toolkit
                    agent.get('/api/toolkits/' + toolkitSaveRes.body._id)
                      .expect(200)
                      .end(function (toolkitInfoErr, toolkitInfoRes) {
                        // Handle Toolkit error
                        if (toolkitInfoErr) {
                          return done(toolkitInfoErr);
                        }

                        // Set assertions
                        (toolkitInfoRes.body._id).should.equal(toolkitSaveRes.body._id);
                        (toolkitInfoRes.body.name).should.equal(toolkit.name);
                        should.equal(toolkitInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Toolkit.remove().exec(done);
    });
  });
});
