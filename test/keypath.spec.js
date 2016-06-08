'use strict';

const keypath = require('../lib/keypath.js');
const test = require('unit.js');

describe('Keypath', () => {
  it('Should set value', () => {
    var obj = {};
    keypath.set(obj, 'a.b.c', 1);

    test.object(obj).hasProperty('a');
    test.object(obj.a).hasProperty('b');
    test.object(obj.a.b).hasProperty('c');
    test.number(obj.a.b.c).is(1);
  });

  it('Should push value', () => {
    var obj = {};
    keypath.push(obj, 'a.b.c', 1);

    test.object(obj).hasProperty('a');
    test.object(obj.a).hasProperty('b');
    test.object(obj.a.b).hasProperty('c');
    test.array(obj.a.b.c).is([1]);
  });

  it('Should get value', () => {
    var obj = {
      a: {
        b: 1
      }
    };

    var value = keypath.get(obj, 'a.b');

    test.number(value).is(1);
  });
});
