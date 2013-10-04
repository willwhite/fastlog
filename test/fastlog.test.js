var assert = require('assert');
var sinon = require('sinon');
var fastlog = require('../index.js');

var util = require('util');
if (!process.env.DEBUG) util.log = function() {};
var spy = sinon.spy(util, 'log');

describe('string logging', function() {
    afterEach(function() { spy.reset(); });
    it('should use provided category', function() {
        var log = fastlog('security');
        log.debug('foo');
        assert.ok(spy.calledWith('[debug] [security] foo'));
        assert.equal(spy.callCount, 1);
    });

    it('should use different log levels', function() {
        var log = fastlog();

        log.debug('foo');
        log.info('foo');
        log.warn('foo');
        log.error('foo');
        log.fatal('foo');

        assert.ok(spy.calledWith('[debug] [default] foo'));
        assert.ok(spy.calledWith('[info] [default] foo'));
        assert.ok(spy.calledWith('[warn] [default] foo'));
        assert.ok(spy.calledWith('[error] [default] foo'));
        assert.ok(spy.calledWith('[fatal] [default] foo'));
        assert.equal(spy.callCount, 5);
    });

    it('should not log message less critial that configured level', function() {
        var log = fastlog('default', 'info');

        log.debug('foo');
        log.info('foo');
        log.warn('foo');
        log.error('foo');
        log.fatal('foo');

        assert.ok(!spy.calledWith('[debug] [default] foo'));
        assert.ok(spy.calledWith('[info] [default] foo'));
        assert.ok(spy.calledWith('[warn] [default] foo'));
        assert.ok(spy.calledWith('[error] [default] foo'));
        assert.ok(spy.calledWith('[fatal] [default] foo'));
        assert.equal(spy.callCount, 4);
    });

    it('should interpolate strings in log messages', function() {
        var log = fastlog();
        log.debug('there is a %s in my %s!', 'snake', 'boot');

        assert.ok(spy.calledWith('[debug] [default] there is a snake in my boot!'));
    });

    it('should log error objects', function() {
        var log = fastlog();

        var err = new Error('someone poisened the water hole!');
        // Stablize stack
        err.stack = 'Error: someone poisened the water hole!\n' +
            '    at Context.<anonymous> (/Users/willwhite/fastlog/test/fastlog.test.js:70:19)\n' +
            '    at Test.Runnable.run (/Users/willwhite/fastlog/node_modules/mocha/lib/runnable.js:211:32)';
        err.culprit = 'sid';
        log.error(err);

        assert.ok(spy.calledWith('[error] [default] Error: someone poisened the water hole!\n' +
            '    at Context.<anonymous> (/Users/willwhite/fastlog/test/fastlog.test.js:70:19)\n' +
            '    at Test.Runnable.run (/Users/willwhite/fastlog/node_modules/mocha/lib/runnable.js:211:32)\n' +
            '    culprit: sid'));
    });
});
