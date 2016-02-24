var expect = require('chai').expect;
var proxyquire   = require('proxyquire');
var MockFirebase = require('mockfirebase').MockFirebase;
var mock;
var fbFile = proxyquire('../../../server/app/routes/game/index.js', {
  firebase: function (url) {
    return (mock = new MockFirebase(url));
  }
});
mock.flush();
// data is logged