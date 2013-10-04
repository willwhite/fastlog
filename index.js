var _ = require('underscore');
var util = require('util');

module.exports = function(category, level) {
    category = category || 'default';
    var levels = ['debug', 'info', 'warn', 'error', 'fatal'];
    return _(levels).reduce(function(logger, l) {
        logger[l] = function() {
            if (levels.indexOf(l) < levels.indexOf(level)) return;
            if (arguments[0] instanceof Error) {
                var err = arguments[0];
                // Error objects passed directly.
                var lines = [err.toString()];
                if (err.stack) {
                    var stack = err.stack.split('\n');
                    lines = lines.concat(stack.slice(1, stack.length));
                }
                _(err).each(function(val, key) {
                    if (_(val).isString() || _(val).isNumber()) lines.push('    ' + key + ': ' + val);
                });
                util.log(util.format('[%s] [%s] %s', l, category, lines.join('\n')));
            } else {
                // Normal string messages.
                var message = util.format.apply(this, arguments);
                util.log(util.format('[%s] [%s] %s', l, category, message));
            }
        };
        return logger;
    }, {});
};
