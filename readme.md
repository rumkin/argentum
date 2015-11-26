Argentum
---

Argentum is a unified command line arguments parser. It parses arguments into
JS values boolean, number, date, string or array of values. Argentum has no
schema like other parsers it just try to parse all passed values.

It has several rules to parse values:
* Rule could be `--name`, `--name=value`, `--name[]` and `--name[]=value`.
* Kebab case converts into camel case `--some-name` becomes `someName`.
* Empty property value is true: `--bool` mean `true`.
* Arrays overwrite previous value: `--arr=1 --arr[]` has empty array with name `arr`.

Note that parsed values pull out from passed array.

## Usage

```javascript
var argentum = require('argentum');

// Parsing
argentum.parse(['--hello=world']); // -> {hello: "world"}

// Splicing
var args = ['--a', 'value', '--b'];
argentum.parse(args); // -> {a: true, b: true}
args; // -> ['value']
```

Parsing results:

| Cli               | JavaScript         |
|:------------------|:-------------------|
| `--hello=world`   | `{hello: 'world'}` |
| `--number=1`      | `{number: 1}`      |
| `--bool`          | `{bool: true}`     |
| `--a[] 1 2`       | `{a: [1,2]}`       |
| `--a[]=1 --a[]=2` | `{a: [1,2]}`       |
