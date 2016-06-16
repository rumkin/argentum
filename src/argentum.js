'use strict';

const keypath = require('../lib/keypath.js');

module.exports.parse = parse;
module.exports.split = split;
module.exports.parseValue = parseValue;

const single = /^-([a-zA-Z]+)/;
const double = /^--([a-zA-Z0-9][a-zA-Z0-9_.-]*)(\[])?(=(.+))?$/;

/**
 * Parse array of options into object.
 *
 * @param  {string[]} argv Array of string.
 * @return {object}      Parsed params.
 */
function parse(argv, options_) {
  var options = Object.assign({}, options_);
  var opts = Object.assign({}, options.defaults);
  var current;
  var currentIsArray = false;
  var aliases = {};

  if (typeof options.aliases === 'object') {
    Object.assign(aliases, options.aliases);
  }

  argv.slice().forEach(function(arg, i){
    var value, name;
    var match = arg.match(double);

    if (match) {
      name = match[1].replace(/-(.)/g, function (m, v) {
        return v.toUpperCase();
      });

      value = typeof match[4] !== 'undefined' ? match[4] : 'true';
      if (name in aliases) {
        name = aliases[name];
      }
      current = name;
      currentIsArray = false;

      var isArray = (match[2] === '[]');
      if (isArray && typeof match[4] === 'undefined') {
        // Skip empty array options like --users[].
        currentIsArray = true;
        keypath.set(opts, name, []);
        return;
      } else if (isArray && ! Array.isArray(keypath.get(opts, name))) {
        keypath.set(opts, name, []);
      }

      value = parseValue(value);

      argv.splice(i, 1);

      if (isArray) {
        keypath.push(opts, name, value);
      } else {
        keypath.set(opts, name, value);
      }
    } else if (match = arg.match(single)) {
      if (current) {
          current = null;
          currentIsArray = false;
      }

      match[1].split('').forEach(function(flag) {
          if (flag in aliases) {
            flag = aliases[flag];
          }
          opts[flag] = true;
      });

      argv.splice(i, 1);
    } else if (currentIsArray) {
      argv.splice(i, 1);
      keypath.push(opts, current, parseValue(arg));
    }
  });

  return opts;
}

function split(args, limit) {
  if (arguments.length < 2) {
    limit = Infinity;
  }

  var i = 0;
  var result = [];
  while (limit-- && (i = args.indexOf('--')) > -1) {
    result.push(args.slice(0, i));
    args = args.slice(i + 1);
  }

  result.push(args.slice());
  return result;
}

/**
 * Parse argument value into js object. It parses booleans, integers and strings.
 *
 * @param  {string} value String value.
 * @return {*}       Parsed JS value.
 */
function parseValue(value) {
  switch (value.toLowerCase()) {
  case 'true':
    value = true;
    break;
  case 'false':
    value = false;
    break;
  default:
    if (value.match(/^-?\d+$/)) {
      value = parseInt(value, 10);
    } else if (value.match(/^-?\d+\.\d+$/)) {
      value = parseFloat(value, 10);
    }
  }

  return value;
}
