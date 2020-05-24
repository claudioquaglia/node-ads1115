/**
 * ADS I2C addresses
 */
export enum ADS1115_ADDRESS {
  ADDR_0x48 = 0x48,
  ADDR_0x49 = 0x49,
  ADDR_0x4A = 0x4a,
  ADDR_0x4B = 0x4b,
}

/**
 * ADS Chanels
 */
export enum ADS1115_CHANNEL {
  CH_0 = 0x4000, // Single-ended AIN0
  CH_1 = 0x5000, // Single-ended AIN1
  CH_2 = 0x6000, // Single-ended AIN2
  CH_3 = 0x7000, // Single-ended AIN3
}

/**
 * Power Gain Amplifier ranges (+/- V)
 */
export enum ADS1115_PGA {
  PGA_6_144V = 0x0000, // +/-6.144V range
  PGA_4_096V = 0x0200, // +/-4.096V range,
  PGA_2_048V = 0x0400, // +/-2.048V range (default)
  PGA_1_024V = 0x0600, // +/-1.024V range
  PGA_0_512V = 0x0800, // +/-0.512V range
  PGA_0_256V = 0x0a00, // +/-0.256V range
}

/**
 * Samples-Per-Second values for the ADS1115 chip (aka data rate). Lower rate = better average
 */
export enum ADS1115_SPS {
  SPS_8 = 0x0000, // 8 samples per second
  SPS_16 = 0x0020, // 16 samples per second,
  SPS_32 = 0x0040, // 32 samples per second
  SPS_64 = 0x0060, // 64 samples per second
  SPS_128 = 0x0080, // 128 samples per second
  SPS_250 = 0x00a0, // 250 samples per second (default)
  SPS_475 = 0x00c0, // 475 samples per second
  SPS_860 = 0x00e0, // 860 samples per second
}

export enum ADS1115_READING_MODE {
  CONTINUOUS = 0x0000, // Continuous conversion mode
  SINGLE = 0x0100, // Power-down single-shot mode (default)
}

export enum ADS1115_REG_CONFIG_OS {
  SINGLE = 0x8000, // Write: Set to start a single-conversion
  BUSY = 0x0000, // Read: Bit = 0 when conversion is in progress
  NOTBUSY = 0x8000, // Read: Bit = 1 when device is not performing a conversion
}

export const ADS1115_SPS_TO_MILLISECONDS: { [key in ADS1115_SPS]: number } = {
  [ADS1115_SPS.SPS_8]: 1000 / 8,
  [ADS1115_SPS.SPS_16]: 1000 / 16,
  [ADS1115_SPS.SPS_32]: 1000 / 32,
  [ADS1115_SPS.SPS_64]: 1000 / 64,
  [ADS1115_SPS.SPS_128]: 1000 / 128,
  [ADS1115_SPS.SPS_250]: 1000 / 250,
  [ADS1115_SPS.SPS_475]: 1000 / 475,
  [ADS1115_SPS.SPS_860]: 1000 / 860,
}

export interface ADS1115OptionsInterface {
  address?: ADS1115_ADDRESS;
  pga?: ADS1115_PGA;
  sps?: ADS1115_SPS;
  mode?: ADS1115_READING_MODE;
}

export interface ADS1115ReadOptionsInterface
  extends Required<Omit<ADS1115OptionsInterface, 'address'>> {
  mux: ADS1115_CHANNEL; // mux (channel or differential bit)
}
