export class UnitConstants {
  // Bytes
  static readonly BYTES_IN_KIB = 1024;
  static readonly BYTES_IN_MIB = 1048576;
  static readonly BYTES_IN_GIB = UnitConstants.BYTES_IN_MIB * UnitConstants.BYTES_IN_KIB;

  // Milliseconds
  static readonly NS_IN_ONE_MS = 1000000;
  static readonly NS_IN_ONE_SECOND = 1e9;
  static readonly MS_IN_ONE_SECOND = 1000;
  static readonly MS_IN_ONE_MINUTE = 60000;
  static readonly MS_IN_ONE_HOUR = 3600000;
  static readonly MS_IN_ONE_DAY = 864e5;

  // Time
  static readonly SECONDS_IN_ONE_MINUTE = 60;
  static readonly MINUTES_IN_ONE_HOUR = 60;
  static readonly HOURS_IN_ONE_DAY = 24;
}
