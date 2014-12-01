#!/usr/bin/env node

var split = require('split');
var fastlog = require('..')(
  process.env.FASTLOG_CATEGORY || 'default',
  process.env.FASTLOG_LEVEL || 'info'
);

var levels = Object.keys(fastlog).reduce(function(memo, k) {
  if (typeof fastlog[k] === 'function') memo.push(k);
  return memo;
}, []);

process.argv.shift();
process.argv.shift();

var level = process.argv.shift();
if (levels.indexOf(level) === -1) {
  console.error('ERROR: invalid log level. Choose from ' + levels.join(', '));
  process.exit(1);
}

var message = process.argv.shift();
if (message) return fastlog[level](message);

process.stdin.pipe(split()).on('data', function(line) {
  if (line) fastlog[level](line);
});
