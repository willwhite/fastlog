var assert = require('assert');
var util = require('util');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var path = require('path');
var fastlog = path.resolve(__dirname, '..', 'bin', 'fastlog.js');

describe('logging via bash', function() {
  it('should use default category', function(done) {
    exec([fastlog, 'info', 'foo'].join(' '), function(err, stdout, stderr) {
      assert.ifError(err, 'logged');
      assert.ok(/^\[.+\] \[info\] \[default\] foo\n$/.test(stdout), 'correct log');
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
      assert.ok(/^\[.+\] \[info\] \[security\] foo\n$/.test(stdout), 'correct log');
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
      assert.ok(/^\[.+\] \[debug\] \[default\] foo\n$/.test(stdout), 'correct log');
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
  it('should listen to stdin when no message is specified', function(done) {
    var proc = spawn(fastlog, [ 'info' ]);
    var expected = [ 'foo', 'bar' ];
    proc.on('close', function(code) {
      assert.equal(code, 0, 'exit 0');
      done();
    });
    proc.stdout.on('data', function(data) {
      data = data.toString().split(' ').slice(-3);
      var msg = expected.shift() + '\n';
      assert.deepEqual(data, [ '[info]', '[default]', msg], 'correct message');
    });
    proc.stdin.write(expected.join('\n'));
    proc.stdin.end();
  });
});
