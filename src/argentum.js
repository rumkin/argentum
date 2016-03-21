'use strict';

module.exports.parse = parse;
module.exports.split = split;
module.exports.parseValue = parseValue;

var single = /^-(.+)/;
var double = /^--([a-zA-Z0-9][a-zA-Z0-9_-]*)(\[])?(=(.+))?$/;

/**
 * Parse array of options into object.
 *
 * @param  {string[]} argv Array of string.
 * @return {object}      Parsed params.
 */
function parse(argv, options_) {
  var options = Object.assign({}, options_);
  var opts = {};
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
        opts[name] = [];
        return;
      } else if (isArray && ! Array.isArray(opts[name])) {
        opts[name] = [];
      }

      value = parseValue(value);

      argv.splice(i, 1);

      if (isArray) {
        opts[name].push(value);
      } else {
        opts[name] = value;
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
      opts[current].push(parseValue(arg));
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
