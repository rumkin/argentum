var test = require('unit.js');
var argentum = require('../src/argentum.js');

describe('Argentum argv parser', function () {
  it('Should return object on parse', function () {
    var result = argentum.parse([]);
    test.object(result);
  });

  it('Should convert name to camelCase', function () {
    var result = argentum.parse(['--test-value']);

    test.object(result).hasProperty('testValue');
  });

  it('Should parse empty rule as boolean true', function () {
    var result = argentum.parse(['--test']);

    test.object(result).hasProperty('test', true);
  });

  it('Should parse "true" as boolean true', function () {
    var result = argentum.parse(['--test=true']);

    test.object(result).hasProperty('test', true);
  });

  it('Should parse "false" as boolean false', function () {
    var result = argentum.parse(['--test=false']);

    test.object(result).hasProperty('test', false);
  });

  it('Should parse integer', function () {
    var result = argentum.parse(['--test=10']);

    test.object(result).hasProperty('test', 10);
  });

  it('Should parse negative integer', function () {
    var result = argentum.parse(['--test=-10']);

    test.object(result).hasProperty('test', -10);
  });

  it('Should parse float', function () {
    var result = argentum.parse(['--test=1.3']);

    test.object(result).hasProperty('test', 1.3);
  });

  it('Should parse negative float', function () {
    var result = argentum.parse(['--test=-1.3']);

    test.object(result).hasProperty('test', -1.3);
  });

  it('Should parse braces as array', function () {
    var result = argentum.parse(['--test[]=1']);

    test.object(result).hasProperty('test');
    test.array(result.test).hasProperty(0, 1);
  });

  it('Should overwrite non-array value', function () {
    var result = argentum.parse(['--test=1', '--test[]=2']);

    test.object(result).hasProperty('test');
    test.array(result.test).hasProperty(0, 2);
  });

  it('Should insert multiple values into array', function () {
    var result = argentum.parse(['--test[]=1', '--test[]=2']);

    test.object(result).hasProperty('test');
    test.array(result.test)
      .hasProperty(0, 1)
      .hasProperty(1, 2);
  });

  it('Should cut matched arguments from source array', function () {
    var args = ['1', 'hello', '--hello=1', 'null'];
    var result = argentum.parse(args);

    test.object(result).hasProperty('hello', 1);
    test.object(args).hasProperty('length', 3);
  });

  it('Should collect bracket properties', function() {
    var args = ['--arr[]', '1', 'true', 'hello', '--not-arr'];
    var result = argentum.parse(args);

    test.object(result).hasProperty('arr');
    test.object(result).hasProperty('notArr', true);
    test.array(result.arr)
      .hasProperty('length', 3)
      .hasProperty('0', 1)
      .hasProperty('1', true)
      .hasProperty('2', 'hello')
      ;
  });
});
