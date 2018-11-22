var assert = require('assert');
var sinon = require('sinon');
var fastlog = require('../index.js');

var spy = sinon.spy(console, 'log');

describe('string logging', function() {
    afterEach(function() { spy.reset(); });
    it('should use provided category', function() {
        var log = fastlog('security');
        log.debug('foo');
        assert.ok(spy.calledWith('%s %s', sinon.match(/\[.+\] \[debug\] \[security\]/), 'foo'));
        assert.equal(spy.callCount, 1);
    });

    it('should return messages', function() {
        var log = fastlog();

        assert.ok(/\[.+\] \[debug\] \[default\] foo/.test(log.debug('foo')));
        assert.ok(/\[.+\] \[info\] \[default\] foo/.test(log.info('foo')));
        assert.ok(/\[.+\] \[warn\] \[default\] foo/.test(log.warn('foo')));
        assert.ok(/\[.+\] \[error\] \[default\] foo/.test(log.error('foo')));
        assert.ok(/\[.+\] \[fatal\] \[default\] foo/.test(log.fatal('foo')));
    });

    it('should use different log levels', function() {
        var log = fastlog();

        log.debug('foo');
        log.info('foo');
        log.warn('foo');
        log.error('foo');
        log.fatal('foo');

        assert.ok(spy.calledWith('%s %s', sinon.match(/\[.+\] \[debug\] \[default\]/), 'foo'));
        assert.ok(spy.calledWith('%s %s', sinon.match(/\[.+\] \[info\] \[default\]/), 'foo'));
        assert.ok(spy.calledWith('%s %s', sinon.match(/\[.+\] \[warn\] \[default\]/), 'foo'));
        assert.ok(spy.calledWith('%s %s', sinon.match(/\[.+\] \[error\] \[default\]/), 'foo'));
        assert.ok(spy.calledWith('%s %s', sinon.match(/\[.+\] \[fatal\] \[default\]/), 'foo'));
        assert.equal(spy.callCount, 5);
    });

    it('should not log message less critial that configured level', function() {
        var log = fastlog('default', 'info');

        log.debug('foo');
        log.info('foo');
        log.warn('foo');
        log.error('foo');
        log.fatal('foo');

        assert.ok(spy.calledWith('%s %s', sinon.match(/\[.+\] \[info\] \[default\]/), 'foo'));
        assert.ok(spy.calledWith('%s %s', sinon.match(/\[.+\] \[warn\] \[default\]/), 'foo'));
        assert.ok(spy.calledWith('%s %s', sinon.match(/\[.+\] \[error\] \[default\]/), 'foo'));
        assert.ok(spy.calledWith('%s %s', sinon.match(/\[.+\] \[fatal\] \[default\]/), 'foo'));
        assert.equal(spy.callCount, 4);
    });

    it('should interpolate strings in log messages', function() {
        var log = fastlog();
        log.debug('there is a %s in my %s!', 'snake', 'boot');

        assert.ok(spy.calledWith('%s %s', sinon.match(/\[.+\] \[debug\] \[default\]/), 'there is a snake in my boot!'));
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

        assert.ok(spy.calledWith('%s %s', sinon.match(/\[.+\] \[error\] \[default\]/), 'Error: someone poisened the water hole!\n' +
            '    at Context.<anonymous> (/Users/willwhite/fastlog/test/fastlog.test.js:70:19)\n' +
            '    at Test.Runnable.run (/Users/willwhite/fastlog/node_modules/mocha/lib/runnable.js:211:32)\n' +
            '    culprit: sid'));
    });

    it('should allow configurable template', function() {
        var log = fastlog('configured', 'info', '[${level}] {${ category }} -- ${timestamp}:');
        log.error('to infinity and beyond!');
        assert.ok(spy.calledWith('%s %s', sinon.match(/\[error\] \{configured\} -- .+?:/), 'to infinity and beyond!'));
        assert.equal(spy.callCount, 1);
    });

    it('should include FASTLOG_GLOBAL_PREFIX in prefix', function() {
        process.env.FASTLOG_GLOBAL_PREFIX = '[global prefix]';
        var log = fastlog();
        log.error('reach for the sky!');
        assert.ok(
            spy.calledWith('%s %s', sinon.match(/\[global prefix\] \[.+\] \[error\] \[default\]/), 'reach for the sky!')
        );
        delete process.env.FASTLOG_GLOBAL_PREFIX;
    });
});
