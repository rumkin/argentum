var test = require('unit.js');
var argentum = require('../src/argentum.js');

describe('Argentum argv parser', function () {
  it('Should return object on parse', function () {
    var result = argentum([]);
    test.object(result);
  });

  it('Should convert name to camelCase', function () {
    var result = argentum(['--test-value']);

    test.object(result).hasProperty('testValue');
  });

  it('Should parse empty rule as boolean true', function () {
    var result = argentum(['--test']);

    test.object(result).hasProperty('test', true);
  });

  it('Should parse "true" as boolean true', function () {
    var result = argentum(['--test=true']);

    test.object(result).hasProperty('test', true);
  });

  it('Should parse "false" as boolean false', function () {
    var result = argentum(['--test=false']);

    test.object(result).hasProperty('test', false);
  });

  it('Should parse integer', function () {
    var result = argentum(['--test=10']);

    test.object(result).hasProperty('test', 10);
  });

  it('Should parse negative integer', function () {
    var result = argentum(['--test=-10']);

    test.object(result).hasProperty('test', -10);
  });

  it('Should parse float', function () {
    var result = argentum(['--test=1.3']);

    test.object(result).hasProperty('test', 1.3);
  });

  it('Should parse negative float', function () {
    var result = argentum(['--test=-1.3']);

    test.object(result).hasProperty('test', -1.3);
  });

  it('Should parse braces as array', function () {
    var result = argentum(['--test[]=1']);

    test.object(result).hasProperty('test');
    test.array(result.test).hasProperty(0, 1);
  });

  it('Should insert multiple values into one array', function () {
    var result = argentum(['--test[]=1', '--test[]=2']);

    test.object(result).hasProperty('test');
    test.array(result.test).hasProperty(0, 1);
    test.array(result.test).hasProperty(1, 2);
  });

  it('Should cut matched arguments from source array', function () {
    var args = ['1', 'hello', '--hello=1', 'null'];
    var result = argentum(args);

    test.object(result).hasProperty('hello', 1);
    test.object(args).hasProperty('length', 3);
  });
});
