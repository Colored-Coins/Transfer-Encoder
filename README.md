# Transfer-Encoder
[![Build Status](https://travis-ci.org/Colored-Coins/Transfer-Encoder.svg?branch=master)](https://travis-ci.org/Colored-Coins/Transfer-Encoder) [![Coverage Status](https://coveralls.io/repos/Colored-Coins/Transfer-Encoder/badge.svg?branch=master)](https://coveralls.io/r/Colored-Coins/Transfer-Encoder?branch=master) [![npm version](https://badge.fury.io/js/cc-transfer-encoder.svg)](http://badge.fury.io/js/cc-transfer-encoder)  [![Slack Status](http://slack.coloredcoins.org/badge.svg)](http://slack.coloredcoins.org)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Transfer-Encoder provides the encode/decode functions between a Colored Coins transfer Object to buffer

### Installation

```sh
$ npm install cc-transfer-encoder
```


### Encode

Params:



```js


```

Returns a new Buffer holding the encoded transfer.

##### Example:

```js
var transferEncoder = require('cc-transfer-encoder')


```

### Decode

Params:

- consume - takes a consumable buffer (You can use [buffer-consumer] like in the example to create one)

Returns a Colored Coins payment Object

##### Example:

```js
var transferEncoder = require('cc-transfer-encoder')

```

### Testing

In order to test you need to install [mocha] globaly on your machine

```sh
$ cd /"module-path"/cc-transfer-Encoder
$ mocha
```


License
----

[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)


[mocha]:https://www.npmjs.com/package/mocha
[buffer-consumer]:https://www.npmjs.com/package/buffer-consumer
