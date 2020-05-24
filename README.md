# NODE-ADS1115

> This module is a work in progress

## Description

Interface for interact with the [ADS1115](https://www.amazon.com/Converter-Programmable-Amplifier-Development-Raspberry/dp/B07TGB6KF8/ref=sr_1_3?crid=ONAVIEMJRW6A&dchild=1&keywords=ads1115&qid=1590334551&sprefix=ads1%2Caps%2C238&sr=8-3) analog to digital converter chips over I2C.

**NB:**
This module is strongly inspired, almost a porting, of the [raspi-kit-ads1x15](https://github.com/kfitzgerald/raspi-kit-ads1x15). The main differences is that this module is compatible **ONLY** with the ADS1115, it use the [i2c-bus](https://github.com/fivdi/i2c-bus) under the hood in place of [Raspi suite](https://github.com/nebrius/raspi), it's written in Typescript and it extends EventEmitter, so when some value change, in each channel, you will be notified for it.

## Installation

```bash
$ - npm install node-ads1115
# or
$ - yarn add node-ads1115
```

## Quick Start

```typescript
import ADS1115, { ADS1115_CHANNEL } from 'node-ads1115';

const module = new ADS1115();

module.readChannel(ADS1115_CHANNEL.CH_0);
module.on('update', (channel, value) => {
  if (channel !== ADS1115_CHANNEL.CH_0) return;

  // Do what you need with the new incoming value
});

module.on('error', error => {
  console.error('Something went wrong on ADS1115 instance', err);

  // Log the error somwhere if needed

  process.exit(1);
});
```

## Enumerator

// TODO

## Apis

// TODO
