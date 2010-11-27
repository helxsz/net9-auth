/* vim: set sw=2 ts=2 nocin si: */

var mongoose = require("mongoose").Mongoose,
    db = mongoose.connect('mongodb://localhost/net9-auth');

mongoose.model('User', {
  properties: ['username', 'password', 'bio'],
  indexes:    ['username']
});
var User = db.model('User');

exports.checkUser = function (username, callback) {
  User.count({ username: username }, function (count) {
    callback(count !== 0);
  });
};

exports.create = function (userinfo, callback) {
  var newUser = new User(userinfo);
  newUser.save(function (err) {
    if (err) callback(false, err);
    else callback(true, newUser.toObject());
  });
};

exports.authenticate = function (userinfo, callback) {
  User.find({ username: userinfo.username }).one(function (user) {
    if (user === null || user.password !== userinfo.password) {
      callback(false, 'user-pass-no-match');
    } else {
      callback(true, user.toObject());
    }
  });
};

exports.update = function (userinfo, callback) {
  User.find({ username: userinfo.username }).one(function (user) {
    user.merge(userinfo).save(function (err) {
      if (err) callback(false, err);
      else callback(true, user.toObject());
    });
  });
};

exports.getApps = function (username, callback) {
  App.find({ owners: username }).all(function (arr) {
    callback(true, arr.map(function (app) { return app.toObject(); }));
  });
};

