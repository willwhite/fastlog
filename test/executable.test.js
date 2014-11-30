var assert = require('assert');
var util = require('util');
var exec = require('child_process').exec;
var path = require('path');
var fastlog = path.resolve(__dirname, '..', 'bin', 'fastlog.js');

describe('logging via bash', function() {
  it('should use default category', function(done) {
    exec([fastlog, 'info', 'foo'].join(' '), function(err, stdout, stderr) {
      assert.ifError(err, 'logged');
      assert.ok(/^\[.+\] \[info\] \[default\] foo\n$/.exec(stdout), 'correct log');
      assert.equal(stderr, '', 'no stderr');
      done();
    });
  });
  it('should abide by env var for category', function(done) {
    var opts = { env: {} };
    for (var k in process.env) opts.env[k] = process.env[k];
    opts.env.FASTLOG_CATEGORY = 'security';
    exec([fastlog, 'info', 'foo'].join(' '), opts, function(err, stdout, stderr) {
      assert.ifError(err, 'logged');
      assert.ok(/^\[.+\] \[info\] \[security\] foo\n$/.exec(stdout), 'correct log');
      assert.equal(stderr, '', 'no stderr');
      done();
    });
  });
  it('should use default log level "info"', function(done) {
    exec([fastlog, 'debug', 'foo'].join(' '), function(err, stdout, stderr) {
      assert.ifError(err, 'logged');
      assert.equal(stdout, '', 'correct log');
      assert.equal(stderr, '', 'no stderr');
      done();
    });
  });
  it('should use custom log levels', function(done) {
    var opts = { env: {} };
    for (var k in process.env) opts.env[k] = process.env[k];
    opts.env.FASTLOG_LEVEL = 'debug';
    exec([fastlog, 'debug', 'foo'].join(' '), opts, function(err, stdout, stderr) {
      assert.ifError(err, 'logged');
      assert.ok(/^\[.+\] \[debug\] \[default\] foo\n$/.exec(stdout), 'correct log');
      assert.equal(stderr, '', 'no stderr');
      done();
    });
  });
  it('should reject a bogus level', function(done) {
    exec([fastlog, 'ham', 'foo'].join(' '), function(err, stdout, stderr) {
      assert.ok(err, 'errors');
      assert.equal(err.code, 1, 'exit 1');
      assert.equal(stderr, 'ERROR: invalid log level. Choose from debug, info, warn, error, fatal\n', 'error message');
      done();
    });
  });
});
