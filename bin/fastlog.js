#!/usr/bin/env node

var split = require('split');
var args = require('minimist')(process.argv.slice(2));

var fastlog = require('..')(
  args.category || 'default',
  process.env.FASTLOG_LEVEL || 'info'
);

var levels = Object.keys(fastlog).reduce(function(memo, k) {
  if (typeof fastlog[k] === 'function') memo.push(k);
  return memo;
}, []);

var level = args._.shift();
if (levels.indexOf(level) === -1) {
  console.error('ERROR: invalid log level. Choose from ' + levels.join(', '));
  process.exit(1);
}

var message = args._.shift();
if (message) return fastlog[level](message);

process.stdin.pipe(split()).on('data', function(line) {
  if (line) fastlog[level](line);
});
