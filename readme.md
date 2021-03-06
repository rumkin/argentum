Argentum
---

![Build](https://img.shields.io/travis/rumkin/argentum.svg)
[![Coverage Status](https://coveralls.io/repos/rumkin/argentum/badge.svg?branch=master&service=github)](https://coveralls.io/github/rumkin/argentum?branch=master)


Argentum is a unified command line arguments parser. It parses arguments into
JS values boolean, number, date, string or array of values. Argentum has no
schema like other parsers it just try to parse all passed values.

It has several rules to parse values:
* Rule could be `--name`, `--name=value`, `--name[]` and `--name[]=value`.
* Kebab case converts into camel case `--some-name` becomes `someName`.
* Empty property value is true: `--bool` mean `true`.
* Arrays overwrite previous value: `--arr=1 --arr[]` has empty array with name `arr`.

Note that parsed values pull out from passed array.

## Example

Argentum converts command line arguments into appropriate JS types.

```shell
node app.js --host=localhost --port=8080 --dirs[] public build
```

Result of parsing is:

```javascript
{
  host: 'localhost',
  port: 8080,
  dirs: ['public', 'build']
}
```

## Usage

```javascript
var argentum = require('argentum');

// Parsing
argentum.parse(['--hello=world']); // -> {hello: "world"}

// Splicing
var args = ['-x', 'value', '-d'];
argentum.parse(args); // -> {x: true, d: true}
args; // -> ['value']
```

Parsing schema

| Cli               | JavaScript         |
|:------------------|:-------------------|
| `-v`              | `{v: true}`        |
| `--hello=world`   | `{hello: 'world'}` |
| `--number=1`      | `{number: 1}`      |
| `--bool`          | `{bool: true}`     |
| `--a[] 1 2`       | `{a: [1,2]}`       |
| `--a[]=1 --a[]=2` | `{a: [1,2]}`       |


## Interface

Package require interface.

## parse(string[], options{}) -> object

Parse array of strings and return an object of properties.

### options.defaults -> object

Default values dictionary. Example:

```javascript
var args = argentum.parse(
    ['--verbose'],
    {defaults:{
        debug: true
    }}
);
args; // -> {debug: true, verbose: true}
```

### options.aliases -> object

Aliases dictionary where key is alias and value is the property. Example:

```javascript
var args = argentum.parse(
    ['-d'],
    {aliases:{
        d: 'debug'
    }}
);
args; // -> {debug: true}
```

### options.eval -> bool

If passed then all string values in source array will be converted in their js
equivalent:

```javascript
var argv = ['1', '10.99', 'true', 'false', 'hello'];
argentum.parse(argv, {eval: true});
argv; // => [1, 10.99, true, false, 'hello']
```

## parseValue(string) -> boolean|number|string

Parse string value to match `true`, `false` or number patterns otherwise return
string.

## split(args string[],limit number) -> string[][]

Split array into two arrays with double hyphen as separator. Limit should match
count of found separators.
