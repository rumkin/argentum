'use strict';

module.exports.get = getByPath;
module.exports.set = setByPath;
module.exports.push = pushByPath;

/**
 * Set deeply nested value into target object. If nested properties are not an
 * objects or not exists creates them.
 *
 * @param {Object} target Parent object.
 * @param {Array} path   Array of path segments.
 * @param {*} value Value to set.
 */
function setByPath(target, path, value) {

  if (! isObject(target)) {
    target = {};
  }

  if (typeof path === 'string') {
    path = path.split('.');
  }

  var tail = path.slice();
  var parent, key;
  parent = target;

  while (tail.length > 1) {
    key = tail.shift();

    if (key in parent === false || ! isObject(parent[key])) {
      parent[key] = {};
    }

    parent = parent[key];
  }

  parent[tail.shift()] = value;

  return target;
}

/**
 * Push deeply nested value into target object. If nested properties are not an
 * objects or not exists creates them.
 *
 * @param {Object} target Parent object.
 * @param {Array} path   Array of path segments.
 * @param {*} value Value to set.
 */
function pushByPath(target, path, value) {
  if (! isObject(target)) {
    target = {};
  }

  if (typeof path === 'string') {
    path = path.split('.');
  }

  var tail = path.slice();
  var parent, key;
  parent = target;

  while (tail.length > 1) {
    key = tail.shift();

    if (key in parent === false || ! isObject(parent[key])) {
      parent[key] = {};
    }

    parent = parent[key];
  }

  key = tail.shift();
  if (! Array.isArray(parent[key])) {
    parent[key] = [];
  }

  parent[key].push(value);

  return target;
}

function getByPath(target, path) {
  if (typeof path === 'string') {
    path = path.split('.');
  }

  var tail = path.slice();
  var key;

  while (tail.length > 1) {
    key = tail.shift();
    if (! isObject(target)) {
      return undefined;
    }

    if (key in target === false) {
      return undefined;
    }

    target = target[key];
  }

  return target[tail.shift()];
}

function isObject(target) {
    return typeof target === 'object' && target !== null;
}
