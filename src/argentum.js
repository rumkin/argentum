'use strict';

module.exports.parse = parse;
module.exports.parseValue = parseValue;


var rule = /^--([a-zA-Z0-9][a-zA-Z0-9_-]*)(\[])?(=(.+))?$/;

/**
 * Parse array of options into object.
 *
 * @param  {string[]} argv Array of string.
 * @return {object}      Parsed params.
 */
function parse(argv) {
  var opts = {};
  var current;
  var currentIsArray = false;

  argv.slice().forEach(function(arg, i){
    var match = arg.match(rule);
    var value, name;

    if (match) {
      name = match[1].replace(/-(.)/g, function (m, v) {
        return v.toUpperCase();
      });

      value = typeof match[4] !== 'undefined' ? match[4] : 'true';
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
    } else if (currentIsArray) {
      argv.splice(i, 1);
      opts[current].push(parseValue(arg));
    }
  });

  return opts;
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
