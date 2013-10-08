[![Build Status](https://travis-ci.org/willwhite/fastlog.png?branch=master)](https://travis-ci.org/willwhite/fastlog)

fastlog
=======

stupid simple logging for Node.js. Prints messages to stdout.

Create a logger:

```javascript
var logger = require('fastlog')(category, level);
```

Both arguments are optional. `category` defaults to to "default" and `level`
defaults to "info". Anything less severe than the given `level` will not be
logged.

The logger functions take a string (interpolation optional):

```javascript
var logger = require('fastlog')('security', 'debug');
logger.debug('there is a %s in my %s!', 'snake', 'boot');
>> 6 Jun 22:52:10 - [debug] [security] there is a snake in my boot!
```

Or an Error object. Any string property that's tacked onto the object will
be logged as well:

```javascript
var err = new Error('someone poisened the water hole!');
err.culprit = 'sid';
logger.error(err);
>> 6 Jun 22:53:38 - [error] [security] Error: someone poisened the water hole!
>>     at Module.runMain (module.js:492:10)
>>     at process.startup.processNextTick.process._tickCallback (node.js:244:9)
>>     culprit: sid
```
