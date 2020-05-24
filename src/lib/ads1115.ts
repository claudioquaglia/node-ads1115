import i2c from 'i2c-bus';
import { EventEmitter } from 'events';

import {
  ADS1115OptionsInterface,
  ADS1115_PGA,
  ADS1115_SPS,
  ADS1115_ADDRESS,
  ADS1115_READING_MODE,
  ADS1115_CHANNEL,
  ADS1115ReadOptionsInterface,
  ADS1115_REG_CONFIG_OS,
  ADS1115_SPS_TO_MILLISECONDS,
} from 'ads1115.interface';
import { sleep } from 'utils';

class ADS1115 extends EventEmitter {
  private readonly _bus: i2c.I2CBus;
  private _address: ADS1115_ADDRESS;
  private _pga: ADS1115_PGA;
  private _sps: ADS1115_SPS;
  private _mode: ADS1115_READING_MODE;
  private _lastContinuousPGA: ADS1115_PGA | undefined = undefined;

  constructor({ address, pga, sps, mode }: ADS1115OptionsInterface) {
    super();
    this._bus = i2c.openSync(1);
    this._address = address ?? ADS1115_ADDRESS.ADDR_0x48;
    this._pga = pga ?? ADS1115_PGA.PGA_2_048V;
    this._sps = sps ?? ADS1115_SPS.SPS_250;
    this._mode = mode ?? ADS1115_READING_MODE.SINGLE;
  }

  public get address(): ADS1115_ADDRESS {
    return this._address;
  }

  public set address(address: ADS1115_ADDRESS) {
    this._address = address;
  }

  public get pga(): ADS1115_PGA {
    return this._pga;
  }

  public set pga(pga: ADS1115_PGA) {
    this._pga = pga;
  }

  public get sps(): ADS1115_SPS {
    return this._sps;
  }

  public set sps(sps: ADS1115_SPS) {
    this._sps = sps;
  }

  public get mode(): ADS1115_READING_MODE {
    return this._mode;
  }

  public set mode(mode: ADS1115_READING_MODE) {
    this._mode = mode;
  }

  private _getSPSTimeout(sps: ADS1115_SPS) {
    return ADS1115_SPS_TO_MILLISECONDS[sps] + 1;
  }

  private _getLastResult = () => {
    const bytes: number[] = (this._bus.i2cReadSync(
      this._address,
      0x00,
      Buffer.allocUnsafe(2)
    ) as unknown) as number[];

    let value = ((bytes[0] & 0xff) << 8) | (bytes[1] & 0xff);
    if ((value & 0x8000) !== 0) {
      value -= 1 << 16;
    }
    return value;
  };

  private _writeConfigRegister = config => {
    const buffer = Buffer.from([(config >> 8) & 0xff, config & 0xff]);
    return this._bus.i2cWriteSync(this._address, 0x01, buffer);
  };

  private async _read(options) {
    let config =
      options.comparatorReadings | // Set comparator readings (or disable)
      options.comparatorLatchingMode | // Set latching mode
      options.comparatorActiveMode | // Set active/ready mode
      options.comparatorMode | // Set comparator mode
      options.mode | // Set operation mode (single, continuous)
      options.sps | // Set sample per seconds
      options.pga | // Set PGA/voltage range
      options.mux | // Set mux (channel or differential bit)
      ADS1115_REG_CONFIG_OS.SINGLE; // Set 'start single-conversion' bit

    // Store pga for future readings
    if (options.mode === ADS1115_READING_MODE.CONTINUOUS) {
      this._lastContinuousPGA = options.pga;
    }

    this._writeConfigRegister(config);
    await sleep(this._getSPSTimeout(options?.sps!));
    return this._getLastResult();
  }

  readChannel(channel: ADS1115_CHANNEL, options?: ADS1115ReadOptionsInterface) {
    // TODO: handle other reading options dynamicaly
    let comparatorReadings = 0x0003; // Disable comparator
    let comparatorLatchingMode = 0x0000; // Non-latching
    let comparatorActiveMode = 0x0000; // Alert/Rdy active low
    let comparatorMode = 0x0000; // traditional comparator

    const _options = {
      mux: channel,
      pga: options?.pga ?? this._pga,
      sps: options?.sps ?? this._sps,
      mode: options?.mode ?? this._mode,
      comparatorLatchingMode,
      comparatorReadings,
      comparatorActiveMode,
      comparatorMode,
    };

    return this._read(_options);
  }
}

export default ADS1115;
