# network-unifi
[![CircleCI](https://circleci.com/gh/ivx/network-unifi.svg?style=svg)](https://circleci.com/gh/ivx/network-unifi) [![Coverage Status](https://coveralls.io/repos/github/ivx/network-unifi/badge.svg?branch=master)](https://coveralls.io/github/ivx/network-unifi?branch=master)

> Library for accessing the unifi network equipment

## Install

Currently, the module is written on Node 10+, without any transpilers, using the
ES2015+ features.

``` sh
npm install --save network-unifi
```

## Usage

``` javascript
const networkUnifi = require('network-unifi')
const options = {
  username: '',
  password: '',
  port: 8443,
  url: 'https://192.168.0.1',
  site: 'default',
  ignoreSsl: false
}

networkUnifi(options)
  .then(router =>
    Promise.all([router.getAccessPoints(), router.getClients()])
  .then(([accessPoints, clients]) => {
    console.log(accessPoints, clients)
  })
```

## API

### networkUnifi(options)

Returns a `Promise` with the Router API

#### options

##### username

Type: `string`

Username for the Router API

##### password

Type: `string`

Password for the Router API


##### port (default:`8443`)

Type: `number`

Port for the Router API


##### url (default:`https://192.168.0.1`)

Type: `string`

URL for the Router API

##### site (default:`default`)

Type: `string`

The site setting for the Router API

##### ignoreSsl (default:`false`)

Type: `boolean`

Ignore SSL warnings, for instance when accessing router API that uses a self signed certificate.

## License

MIT © InVision AG
