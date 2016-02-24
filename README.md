[![Build Status](https://travis-ci.org/willwhite/fastlog.png?branch=master)](https://travis-ci.org/willwhite/fastlog)

fastlog
=======

stupid simple logging for Node.js. Prints messages to stdout.

Create a logger:

```javascript
var logger = require('fastlog')(category, level);
```

`logger` then has a functions named after each of the available log levels.
Levels are (in order of severity) `debug`, `info`, `warn`, `error` and `fatal`.

Both arguments are optional. `category` defaults to to "default" and `level`
defaults to "debug". Anything less severe than the given `level` will not be
logged.

The logger functions take a string (interpolation optional):

```javascript
var logger = require('fastlog')('security', 'debug');
logger.debug('there is a %s in my %s!', 'snake', 'boot');
// [Fri, 05 Dec 2014 02:10:48 GMT] [debug] [security] there is a snake in my boot!
```

Or an Error object. Any string property that's tacked onto the object will
be logged as well:

```javascript
var err = new Error('someone poisoned the water hole!');
err.culprit = 'sid';
logger.error(err);
// [Fri, 05 Dec 2014 02:10:48 GMT] [error] [security] Error: someone poisoned the water hole!
//     at Module.runMain (module.js:492:10)
//     at process.startup.processNextTick.process._tickCallback (node.js:244:9)
//     culprit: sid
```

You can format your own prefix as well:
```javascript
var logger = require('fastlog')('configured', 'error', '${level} [${ category }] <${timestamp}>');
logger.error('This town ain\'t big enough for the two of us!');
// error [configured] <Fri, 05 Dec 2014 02:10:48 GMT> This town ain't big enough for the two of us!
```

## Usage via shell scripts

You may also use fastlog in shell scripts. First, make sure fastlog is installed globally
```
npm install -g fastlog
```

**`fastlog <level> [--category=<category>] [message]`**

```sh
> fastlog error --category important "You're my favorite deputy"
# [Fri, 05 Dec 2014 03:17:59 GMT] [error] [important] You're my favorite deputy
```

- Configure verbosity by specifying a `FASTLOG_LEVEL` environment variable.
- Configure your prefix with a `FASTLOG_PREFIX` environment variable.
- Specifying a `category` is optional

```sh
> export FASTLOG_LEVEL=info
> export FASTLOG_PREFIX='<${timestamp}>'
> fastlog debug "I think you've had enough tea for today, let's get you outta here, Buzz."
# (nothing prints)
> fastlog error "I think you've had enough tea for today, let's get you outta here, Buzz."
# <Fri, 05 Dec 2014 03:22:29 GMT> I think you've had enough tea for today, let's get you outta here, Buzz.
```
