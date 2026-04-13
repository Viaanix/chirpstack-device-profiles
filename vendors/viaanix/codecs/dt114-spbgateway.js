/*! Codec: SPBGateway.js, Generated: 3/28/2026, 1:11:22 PM Git: Branch [feat/dt114-spbgateway] Commit Hash: [cfcb88f3ac385cf3877fb3bc42bcfd68812729cf] */
class BufferReader {
  constructor(e2) {
    this.buffer = e2, this.offset = 0;
  }
  getStatus() {
    return `Buffer Length: [${this.buffer.length}] Offset: [${this.offset}] Bytes Left: [${this.buffer.length - this.offset}]`;
  }
  hasNextByte() {
    return this.buffer.length > this.offset;
  }
  readBits(e2 = 8, t2 = 1) {
    const r2 = [], _2 = Math.ceil(e2 / 8);
    for (let a = 0; a < _2; a++) {
      const _3 = this.buffer.readUInt8(this.getAndIncOffset(1));
      let n = 1;
      for (let e3 = 0; e3 < t2; e3++) n |= n << e3;
      for (let E = 0, s = 0; s < Math.min(e2, 8); s += t2, E++) r2[E + Math.floor(8 * a / t2)] = _3 >> s & n;
    }
    return r2;
  }
  readInt8(e2 = this.getAndIncOffset(1)) {
    return this.buffer.readInt8(e2);
  }
  readUInt8(e2 = this.getAndIncOffset(1)) {
    return this.buffer.readUInt8(e2);
  }
  readInt16LE(e2 = this.getAndIncOffset(2)) {
    return this.buffer.readInt16LE(e2);
  }
  readInt16BE(e2 = this.getAndIncOffset(2)) {
    return this.buffer.readInt16BE(e2);
  }
  readUInt16BE(e2 = this.getAndIncOffset(2)) {
    return this.buffer.readUInt16BE(e2);
  }
  readUInt16LE(e2 = this.getAndIncOffset(2)) {
    return this.buffer.readUInt16LE(e2);
  }
  readInt32LE(e2 = this.getAndIncOffset(4)) {
    return this.buffer.readInt32LE(e2);
  }
  readUInt32BE(e2 = this.getAndIncOffset(4)) {
    return this.buffer.readUInt32BE(e2);
  }
  readUInt32LE(e2 = this.getAndIncOffset(4)) {
    return this.buffer.readUInt32LE(e2);
  }
  readBigUIntLE(e2 = 8) {
    const t2 = this.readBuffer(e2);
    let r2 = BigInt(0);
    for (let e3 = t2.length - 1; e3 >= 0; e3--) r2 = (r2 << BigInt(8)) + BigInt(t2[e3]);
    return r2;
  }
  reader(e2 = 8, t2 = false, r2 = "LE") {
    return 8 === e2 ? t2 ? this.readInt8() : this.readUInt8() : 16 === e2 ? "BE" === r2 ? t2 ? this.readInt16BE() : this.readUInt16BE() : t2 ? this.readInt16LE() : this.readUInt16LE() : 32 === e2 ? "BE" === r2 ? t2 ? this.readInt32BE() : this.readUInt32BE() : t2 ? this.readInt32LE() : this.readUInt32LE() : void 0;
  }
  readFloatLE(e2 = this.getAndIncOffset(4)) {
    return this.buffer.readFloatLE(e2);
  }
  readString(e2) {
    return this.buffer.toString(void 0, this.getAndIncOffset(e2), this.offset).replace(/\0/g, "");
  }
  readHex(e2) {
    return this.buffer.toString("hex", this.getAndIncOffset(e2), this.offset);
  }
  readBuffer(e2) {
    return this.buffer.subarray(this.getAndIncOffset(e2), this.offset);
  }
  readOffsetBuffer() {
    return this.buffer.subarray(this.offset, this.getLeftSize());
  }
  getAndIncOffset(e2 = 1) {
    if (this.offset += e2, this.offset > this.buffer.length) throw new Error(`Index Out Of Bounds! ${this.buffer}`);
    return this.offset - e2;
  }
  getLeftSize() {
    return this.buffer.length - this.offset;
  }
  getOffset() {
    return [this.buffer.length, this.offset];
  }
  getOffsetBuffer() {
    return this.readBuffer(this.getLeftSize());
  }
}
const isDebug = () => JSON.parse(false);
class DataTypeNotFound extends Error {
  constructor(e2, t2, ...r2) {
    const _2 = `[!!!] Data type not found: ${e2}. Buffer: ${t2.toString("hex")}`;
    super(_2, ...r2), this.message = [_2, ...r2].join(" ");
  }
}
class DataError extends Error {
  constructor(e2, t2, r2) {
    let _2 = `[!!!] Data Error ${e2}. Buffer: ${t2.toString("hex")}`;
    r2.deviceType && (_2 += ` Device Type: ${r2.deviceType}`), super(_2, r2), this.message = _2;
  }
}
class BaseDataType {
  constructor(e2, t2) {
    this.dataId = null, this.deviceType = t2 || null, this.typeBufferReader = e2, this.debug = JSON.parse(false);
  }
  get typeBufferReader() {
    return this._bufferReader;
  }
  set typeBufferReader(e2) {
    this._inputBuffer = e2, this._bufferReader = new BufferReader(e2);
  }
  get deviceType() {
    return this._deviceType;
  }
  set deviceType(e2) {
    this._deviceType = e2;
  }
  get decoded() {
    return this._decoded;
  }
  set decoded(e2) {
    this._decoded = { ...this._decoded, ...e2 };
  }
  decodeBuffer() {
    this.decoded = {};
  }
  processBuffer() {
    try {
      this.decodeBuffer();
    } catch (e2) {
      throw new DataError(`${this.dataId}`, this.typeBufferReader.buffer, { deviceType: this.deviceType, message: e2.message });
    }
    return this.decoded;
  }
  static extractPayload(e2) {
    throw new Error("extractPayload not implemented");
  }
}
const e = { 0: "MCU_REBOOT", 1: "GET_FIRMWARE_VERSION", 2: "GET_HARDWARE_VERSION", 3: "SET_FW_AS_VALID", 4: "GET_IMEI_SIM_ICC", 5: "CLEAR_TOTAL_RESET_COUNTER", 6: "TRIGGER_APP_CHECK_IN", 7: "START_BLE_SCAN", 8: "STOP_BLE_SCAN", 9: "GET_BLE_SAMPLES", 10: "ACK_COMMAND", 11: "UNLOCK_DOOR", 12: "QUERY_PIN", 13: "QUERY_7_BYTE_RFID", 14: "LIGHTS_ON_OFF", 15: "BEACON_ON_OFF", 16: "BUZZER_ON_OFF", 17: "VALIDATED_PIN", 18: "VALIDATED_RFID", 26: "GET_IO_STATES", 27: "TEST_NODE_COMM", 28: "NODE_COMM_ACK", 29: "CLEAR_NOTSENT_FILE", 31: "SET_COMM_MODE", 32: "GET_COMM_MODE" }, t = { 0: "LORAWAN_ONLY", 1: "CELLULAR_ONLY", 2: "AUTO_MODE" };
const r = function buildSupportedDataTypes(e2) {
  const t2 = {};
  return e2.forEach((e3) => {
    const r2 = e3.name.replace("DT", "");
    t2[r2] = { name: `${e3.name}`, class: e3 };
  }), t2;
}([class DT25 extends BaseDataType {
  constructor(e2, t2) {
    super(e2, t2), this.dataId = "DT25", this.debug;
  }
  convertDMSTtoDD(e2, t2, r2, _2, a) {
    let n;
    return n = e2 + (t2 + (100 * r2 + _2) / 1e4) / 60, "S" !== a && "W" !== a || (n *= -1), n;
  }
  decodeBuffer() {
    const e2 = this.typeBufferReader.readUInt8(), t2 = this.typeBufferReader.readUInt8(), r2 = this.typeBufferReader.readUInt8(), _2 = this.typeBufferReader.readUInt8(), a = this.typeBufferReader.readUInt8(), n = String.fromCharCode(a), E = this.typeBufferReader.readUInt8(), s = this.typeBufferReader.readUInt8(), O = this.typeBufferReader.readUInt8(), f = this.typeBufferReader.readUInt8(), d = this.typeBufferReader.readUInt8(), T = String.fromCharCode(d);
    this.decoded = { directionLat: n, latitude: this.convertDMSTtoDD(e2, t2, r2, _2, n), directionLong: T, longitude: this.convertDMSTtoDD(E, s, O, f, T), timeToFix: this.typeBufferReader.readUInt32BE(), satellites: this.typeBufferReader.readUInt8() };
  }
  static extractPayload(e2) {
    return e2.readBuffer(15);
  }
}, class DT46 extends BaseDataType {
  constructor(e2) {
    super(e2), this.dataId = "DT46", this.debug;
  }
  decodeBuffer() {
    this.decoded = { temperature: this.typeBufferReader.readInt8() };
  }
  static extractPayload(e2) {
    return e2.readBuffer(1);
  }
}, class DT61 extends BaseDataType {
  constructor(e2, t2) {
    super(e2, t2), this.dataId = "DT61", this.debug;
  }
  decodeBuffer() {
    const e2 = ["START_OF_MOVEMENT", "END_OF_MOVEMENT", "NO_GPS_FIX_DETECTED", "POWER_UP_DETECTED", "POWER_DOWN_DETECTED", "REBOOT_ACK", "GET_FW_VERSION_ACK", "GET_HW_VERSION_ACK", "SET_FW_VALID_ACK", "GET_IMEI_ACK", "CLEAR_RESET_COUNT_ACK", "TRIGGER_APP_CHECK_IN_ACK", "GOING_TO_SHIP_MODE", "GOING_TO_NORMAL_MODE", "GOING_TO_BATTERY_MODE", "INV_SCAN_POWER_UP", "INV_SCAN_POWER_DOWN", "INV_SCAN_FREQUENCY", "INV_SCAN_BUTTON", "INV_SCAN_PLATFORM", "GPS_CHECK_IN", "INV_SCAN_DOOR", "KEY_0", "KEY_1", "KEY_2", "KEY_3", "KEY_4", "KEY_5", "KEY_6", "KEY_7", "KEY_8", "KEY_9", "KEY_STAR", "KEY_POND", "COMMAND_OPEN_DOOR_ACK", "PIN_APPROVED", "PIN_DENIED", "RFID_APPROVED", "RFID_DENIED", "TOO_MANY_WRONG_UNLOCKS", "DOOR_KEPT_OPEN", "AC_POWER_CONNECTED", "AC_POWER_DISCONNECTED", "BATTERY_CONNECTED", "BATTERY_DISCONNECTED", "DC_POWER_CONNECTED", "DC_POWER_DISCONNECTED", "INTERNAL_LIGHTS_ON", "INTERNAL_LIGHTS_OFF", "BEACON_LIGHT_ON", "BEACON_LIGHT_OFF", "DOOR_UNLOCKED", "LEFT_DOOR_LOCKED", "RIGHT_DOOR_LOCKED", "ZERO_ACCESS_ACTIVATED", "ZERO_ACCESS_DEACTIVATED", "DOOR_OPENED_FORCEFULLY", "TILT_DETECTED", "LOCK_MANUAL_OVERRIDE", "TILT_NOT_DETECTED", "HEARTBEAT", "INV_SCAN_POWER_UP_EXT", "INV_SCAN_POWER_DOWN_EXT", "INV_SCAN_FREQUENCY_EXT", "INV_SCAN_BUTTON_EXT", "INV_SCAN_PLATFORM_EXT", "INV_SCAN_DOOR_EXT", "COM_MODE_LORAWAN", "COM_MODE_CELLULAR", "COM_MODE_AUTO_LORAWAN", "COM_MODE_AUTO_CELLULAR"], t2 = { BLG: { events: ["NO_MESSAGE_TO_SEND", "MORE_THAN_2_HIGH_RSSI", "MORE_THAN_2_LOW_RSSI", "LESS_THAN_3_HIGH_RSSI", "LESS_THAN_3_LOW_RSSI", "SCAN_TOO_MANY_TIMES", "NO_DEVICES_DETECTED", "NO_GPS_FIX_DETECTED", "START_OF_MOVEMENT", "END_OF_MOVEMENT", "BUTTON_PRESSED", "BUTTON_RELEASED", "MAGNET_ACTIVATED", "MAGNET_RELEASED", "GOING_TO_SHIP_MODE", "GOING_TO_NORMAL_MODE", "STILL_MOVING", "ANGLE_LIMIT_DETECTED", "ANGLE_BACK_TO_NORMAL", "ANGLE_STILL_HIGH", "NO_LH_INDOOR", "LH_INDOOR_LOW_RSSI", "LH_INDOOR_HIGH_RSSI"] }, BLEGateway: { events: ["START_OF_MOVEMENT", "END_OF_MOVEMENT", "NO_GPS_FIX_DETECTED", "POWER_UP_DETECTED", "POWER_DOWN_DETECTED", "REBOOT_ACK", "GET_FW_VERSION_ACK", "GET_HW_VERSION_ACK", "SET_FW_VALID_ACK", "GET_IMEI_ACK", "CLEAR_RESET_COUNT_ACK", "TRIGGER_APP_CHECK_IN_ACK", "GOING_TO_SHIP_MODE", "GOING_TO_NORMAL_MODE", "GOING_TO_BATTERY_MODE", "INV_SCAN_POWER_UP", "INV_SCAN_POWER_DOWN", "INV_SCAN_FREQUENCY", "INV_SCAN_BUTTON", "INV_SCAN_PLATFORM", "GPS_CHECK_IN", "INV_SCAN_DOOR", "KEY_0", "KEY_1", "KEY_2", "KEY_3", "KEY_4", "KEY_5", "KEY_6", "KEY_7", "KEY_8", "KEY_9", "KEY_STAR", "KEY_POND", "COMMAND_OPEN_DOOR_ACK"] }, SPBGateway: { events: e2 }, Turnstile: { events: e2 }, FlowMeter: { events: ["ANALYTE_NOT_INCREASING", "CATOLYTE_NOT_INCREASING", "CELL_WAS_DISCONNECTED", "PUMP_ON_RELAY_OFF", "PUMP_OFF_RELAY_ON", "PI_BLE_NOT_DETECTED"] }, FMSBoard: { events: ["NO_GPS_FIX_DETECTED", "POWER_UP_DETECTED", "REBOOT_ACK", "GET_FW_VERSION_ACK", "GET_HW_VERSION_ACK", "SET_FW_VALID_ACK", "GET_IMEI_ACK", "CLEAR_RESET_COUNT_ACK", "TRIGGER_APP_CHECK_IN_ACK", "CELL_WAS_DISCONNECTED", "RELAY_PUMP_OFF", "RELAY_PUMP_ON", "PUMP_TIME_OUT", "RESET_DURING_TRANSACTION", "LEVEL_SENSOR_DATA_ERROR", "PUMP_RUNNING", "HEARTBEAT"] }, LocationHub: { events: ["REBOOT", "ALERT_EVENT", "BUTTON_1_PRESSED", "BUTTON_2_PRESSED", "BUTTON_3_PRESSED", "BUTTON_4_PRESSED", "FUOTA_CHECK_IN"] }, "VX-0056": { events: ["REBOOT", "POWER_ON", "POWER_OFF", "HEARTBEAT", "DOOR_1_OPENED", "DOOR_1_CLOSED", "DOOR_1_UNLOCKED", "DOOR_1_LOCKED", "DOOR_1_ALARM_MINOR", "DOOR_1_ALARM_MAJOR", "DOOR_1_ALARM_LOCKED_WITH_OPEN_DOOR", "DOOR_1_ALARM_MANUAL_OVERRIDE", "DOOR_2_OPENED", "DOOR_2_CLOSED", "DOOR_2_UNLOCKED", "DOOR_2_LOCKED", "DOOR_2_ALARM_MINOR", "DOOR_2_ALARM_MAJOR", "DOOR_2_ALARM_LOCKED_WITH_OPEN_DOOR", "DOOR_2_ALARM_MANUAL_OVERRIDE", "LOCKDOWN_ENABLED", "LOCKDOWN_DISABLED", "FUOTA_CHECK_IN", "START_OF_MOVEMENT", "END_OF_MOVEMENT", "TILT_NOT_DETECTED", "TILT_DETECTED", "BUTTON_PRESSED"] } }, r2 = {};
    try {
      r2[`${this.deviceType}_appLogic`] = t2[this.deviceType].events[this.typeBufferReader.readInt8()];
    } catch (e3) {
      throw new DataError("DT61", this.typeBufferReader.buffer, { deviceType: this.deviceType, message: e3.message });
    }
    this.decoded = { merge: r2 };
  }
  static extractPayload(e2) {
    return e2.readBuffer(1);
  }
}, class DT66 extends BaseDataType {
  constructor(e2) {
    super(e2), this.dataId = "DT66", this.debug;
  }
  decodeBuffer() {
    const e2 = this.typeBufferReader.readUInt16LE(), t2 = this.typeBufferReader.readUInt16LE(), r2 = this.typeBufferReader.readUInt16LE();
    this.decoded = { fwVersion: `${e2}.${t2}.${r2}` };
  }
  static extractPayload(e2) {
    return e2.readBuffer(8);
  }
}, class DT71 extends BaseDataType {
  constructor(e2, t2) {
    super(e2, t2), this.dataId = "DT71", this.debug;
  }
  getSettingsValue(e2) {
    const t2 = this.getDeviceSettings()[e2] || "Unknown";
    if ("Unknown" === t2) return {};
    const r2 = {};
    return 1 === t2.noOfBytes ? r2[t2.name] = t2?.signed ? this.typeBufferReader.reader(8, t2.signed) : this.typeBufferReader.readUInt8() : 2 === t2.noOfBytes ? "FMSBoard" === this.deviceType && [7, 8, 9].includes(e2) ? r2[t2.name] = this.typeBufferReader.readUInt16LE() : t2?.handler ? r2[t2.name] = this.specialCaseHandler[t2.handler](this.typeBufferReader.readBuffer(2)) : t2?.readAsUint16LE ? r2[t2.name] = this.typeBufferReader.readUInt16LE() : "VX-0056" === this.deviceType ? (r2[`${t2.name}_UNIT`] = this.typeBufferReader.readUInt8(), r2[`${t2.name}_VALUE`] = this.typeBufferReader.readUInt8()) : "SPBGateway" === this.deviceType && 20 === e2 ? (r2[t2.name + "_NODE1_GAIN"] = this.typeBufferReader.readInt8(), r2[t2.name + "_NODE2_GAIN"] = this.typeBufferReader.readInt8()) : (r2[`${t2.name}Unit`] = this.typeBufferReader.readUInt8(), r2[`${t2.name}Value`] = this.typeBufferReader.readUInt8()) : 3 === t2.noOfBytes ? r2[t2.name] = this.typeBufferReader.readInt8() : 4 === t2.noOfBytes && (r2[t2.name] = this.typeBufferReader.readUInt32LE()), r2;
  }
  get specialCaseHandler() {
    return { parseBeaconPingMSDecimal: (e2) => {
      const t2 = e2.reverse().toString("hex");
      return parseInt(t2, 16);
    } };
  }
  decodeBuffer() {
    for (this.decoded = { payloadLength: this.typeBufferReader.buffer.length }; this.typeBufferReader.hasNextByte(); ) {
      const e2 = this.typeBufferReader.readUInt8();
      this.decoded = { ...this.decoded, ...this.getSettingsValue(e2) };
    }
  }
  getDeviceSettings() {
    return { BLG: { 0: { name: "UNKNOWN", noOfBytes: 0 }, 1: { name: "BEACON_PING_RATE_MS", noOfBytes: 2, handler: "parseBeaconPingMSDecimal" }, 2: { name: "END_OF_MOVEMENT", noOfBytes: 2 }, 3: { name: "DURING_MOVEMENT", noOfBytes: 2 }, 4: { name: "ACCELEROMETER_THRESHOLD", noOfBytes: 1 }, 5: { name: "ACCELEROMETER_DURATION", noOfBytes: 1 }, 6: { name: "BEACON_TX_POWER_DBM", noOfBytes: 1 }, 7: { name: "RECEIVE_WINDOW_TIME", noOfBytes: 1 }, 8: { name: "OS_CHECK_IN_TIME", noOfBytes: 2 }, 9: { name: "APP_CHECK_IN_TIME", noOfBytes: 2 }, 10: { name: "GPS_BLE_TRIGGER_DBM", noOfBytes: 3 }, 11: { name: "BLE_HIGH_RSSI_THRESHOLD_DBM", noOfBytes: 3 }, 12: { name: "GPS_ENABLE", noOfBytes: 1 }, 13: { name: "ANGLE_THRESHOLD_DEGREES", noOfBytes: 1 } }, FlowMeter: { 0: { name: "UNKNOWN", noOfBytes: 0 }, 1: { name: "chkInOs", noOfBytes: 2 }, 2: { name: "chkInApp", noOfBytes: 2 }, 3: { name: "bleScanDuration", noOfBytes: 2 }, 4: { name: "enableGps", noOfBytes: 1 }, 5: { name: "enableScan", noOfBytes: 1 }, 6: { name: "flowChkTime", noOfBytes: 2 }, 7: { name: "autoRstRelayEnable", noOfBytes: 1 } }, FMSBoard: { 0: { name: "UNKNOWN", noOfBytes: 0 }, 1: { name: "chkInOs", noOfBytes: 2 }, 2: { name: "enableGps", noOfBytes: 1 }, 3: { name: "chkInApp", noOfBytes: 2 }, 4: { name: "flowMeterTimeout", noOfBytes: 2 }, 5: { name: "flowMeterRatioVal", noOfBytes: 1 }, 6: { name: "flowMeterUnit", noOfBytes: 1 }, 7: { name: "tankParameter1", noOfBytes: 2 }, 8: { name: "tankParameter2", noOfBytes: 2 }, 9: { name: "tankParameter3", noOfBytes: 2 }, 10: { name: "tankType", noOfBytes: 1 } }, BLEGateway: { 0: { name: "UNKNOWN", noOfBytes: 0 }, 1: { name: "chkInOs", noOfBytes: 2 }, 2: { name: "chkInAppLp", noOfBytes: 2 }, 3: { name: "bleScanDuration", noOfBytes: 2 }, 4: { name: "enableGps", noOfBytes: 1 }, 5: { name: "enableScan", noOfBytes: 1 }, 6: { name: "chkInApp", noOfBytes: 2 }, 7: { name: "eom", noOfBytes: 2 }, 8: { name: "accelThreshold", noOfBytes: 1 }, 9: { name: "accelDuration", noOfBytes: 1 } }, SPBGateway: { 0: { name: "UNKNOWN", noOfBytes: 0 }, 1: { name: "chkInOs", noOfBytes: 2 }, 2: { name: "chkInAppLp", noOfBytes: 2 }, 3: { name: "bleScanDuration", noOfBytes: 2 }, 4: { name: "enableGps", noOfBytes: 1 }, 5: { name: "enableScan", noOfBytes: 1 }, 6: { name: "chkInApp", noOfBytes: 2 }, 7: { name: "eom", noOfBytes: 2 }, 8: { name: "accelThreshold", noOfBytes: 1 }, 9: { name: "accelDuration", noOfBytes: 1 }, 10: { name: "gpsChkInTime", noOfBytes: 2 }, 11: { name: "wrongUnlockThresh", noOfBytes: 1 }, 12: { name: "zeroAccess", noOfBytes: 1 }, 13: { name: "doorOpenLimit", noOfBytes: 2 }, 14: { name: "lightOnDoorOpenAc", noOfBytes: 2 }, 15: { name: "lightOnDoorOpenDc", noOfBytes: 2 }, 16: { name: "lightSensorThresh", noOfBytes: 1 }, 17: { name: "rotatingPin", noOfBytes: 4 }, 18: { name: "accessEnabled", noOfBytes: 1 }, 19: { name: "SAVE_NOT_SENT_ENABLED", noOfBytes: 1 }, 20: { name: "EXT_NODE_ANT_GAINS", noOfBytes: 2 } }, LocationHub: { 0: { name: "UNKNOWN", noOfBytes: 0 }, 1: { name: "SCAN_INTERVAL", noOfBytes: 2 }, 2: { name: "SCAN_START_TIME_HH", noOfBytes: 1 }, 3: { name: "SCAN_START_TIME_MM", noOfBytes: 1 }, 4: { name: "SCAN_DURATION_TIME_SEC", noOfBytes: 1 }, 5: { name: "SCAN_OS_START_TIME_HH", noOfBytes: 1 }, 6: { name: "SCAN_OS_START_TIME_MM", noOfBytes: 1 }, 7: { name: "SCAN_OS_INTERVAL", noOfBytes: 2 }, 8: { name: "LATENCY_TIME", noOfBytes: 2 }, 9: { name: "EXPIRATION_TIME", noOfBytes: 2 }, 10: { name: "LH_DEVICE_TYPE", noOfBytes: 1 }, 11: { name: "SCAN_RSSI_THRESHOLD", noOfBytes: 1, signed: true }, 12: { name: "LED_ENABLED", noOfBytes: 1 }, 13: { name: "LOW_BATTERY_MODE_ENABLED", noOfBytes: 1 }, 14: { name: "LED_BLE_SCAN_BLINK_PERIOD", noOfBytes: 1 }, 15: { name: "LED_SENDING_DATA_BLINK_PERIOD", noOfBytes: 1 }, 16: { name: "LED_WAITING_SEND_BLINK_PERIOD", noOfBytes: 1 }, 17: { name: "LED_JOIN_FAILED_BLINK_PERIOD", noOfBytes: 1 }, 18: { name: "LED_LOW_BATT_BLINK_PERIOD", noOfBytes: 1 }, 19: { name: "LED_KEEP_ALIVE_PERIOD", noOfBytes: 1 }, 20: { name: "BEACON_PING_RATE_MS", noOfBytes: 2, handler: "parseBeaconPingMSDecimal" }, 21: { name: "BEACON_TX_POWER_DBM", noOfBytes: 1, signed: true } }, "VX-0056": { 0: { name: "UNKNOWN", noOfBytes: 0 }, 1: { name: "HEARTBEAT_INTERVAL", noOfBytes: 2, readAsUint16LE: true }, 2: { name: "OPEN_DURATION", noOfBytes: 1 }, 3: { name: "OS_CHECK_IN_TIME_HH", noOfBytes: 1 }, 4: { name: "OS_CHECK_IN_TIME_MM", noOfBytes: 1 }, 5: { name: "OS_CHECK_IN_INTERVAL", noOfBytes: 2 }, 6: { name: "LOCKDOWN_MODE", noOfBytes: 1 }, 7: { name: "MINOR_ALERT_TIME", noOfBytes: 1 }, 8: { name: "MAJOR_ALERT_TIME", noOfBytes: 1 }, 9: { name: "APP_CHECK_IN_TIME", noOfBytes: 2 }, 10: { name: "LATENCY_TIME", noOfBytes: 2 }, 11: { name: "RELAY_MODE", noOfBytes: 1 }, 12: { name: "DUAL_LOCK_MODE", noOfBytes: 1 }, 13: { name: "END_OF_MOVEMENT", noOfBytes: 2 }, 14: { name: "ACCELEROMETER_THRESHOLD", noOfBytes: 1 }, 15: { name: "ACCELEROMETER_DURATION", noOfBytes: 1 } } }[this.deviceType];
  }
  static extractPayload(e2) {
    const t2 = e2.readUInt16LE();
    return e2.readBuffer(t2);
  }
}, class DT75 extends BaseDataType {
  constructor(e2, t2) {
    super(e2, t2), this.dataId = "DT75", this.debug;
  }
  decodeBuffer() {
    const r2 = this.typeBufferReader.readUInt8(), _2 = e[r2] ?? null;
    switch (r2) {
      case 12:
      case 17: {
        const e2 = this.typeBufferReader.readUInt32LE();
        this.decoded = { commandName: _2, queryPin: e2 };
        break;
      }
      case 13:
      case 18: {
        const e2 = [];
        for (let t3 = 0; t3 < 7; t3++) e2.push(this.typeBufferReader.readUInt8());
        e2.reverse();
        const t2 = BigInt("0x" + e2.map((e3) => e3.toString(16).padStart(2, "0")).join("")).toString();
        this.decoded = { commandName: _2, rfid: t2 };
        break;
      }
      case 28: {
        const e2 = this.typeBufferReader.readUInt8();
        this.decoded = { commandName: _2, nodeCommunication: 1 == (3 & e2), node2: !!(4 & e2), node3: !!(8 & e2), node4: !!(16 & e2), node5: !!(32 & e2), node6: !!(64 & e2) };
        break;
      }
      case 31:
      case 32: {
        const e2 = this.typeBufferReader.readUInt8();
        this.decoded = { commandName: _2, commMode: t[e2] ?? e2 };
        break;
      }
      default: {
        const e2 = this.typeBufferReader.getLeftSize(), t2 = e2 > 0 ? this.typeBufferReader.readHex(e2) : null;
        this.decoded = { command: r2, commandName: _2, commandData: t2 };
        break;
      }
    }
  }
  static extractPayload(e2) {
    const t2 = e2.readUInt16LE();
    return e2.readBuffer(t2);
  }
}, class DT87 extends BaseDataType {
  constructor(e2, t2) {
    super(e2, t2), this.dataId = "DT87", this.debug;
  }
  decodeBuffer() {
    if ("SPBGateway" === this.deviceType) {
      const e2 = 0 | this.typeBufferReader.readUInt16LE(), t2 = this.typeBufferReader.readUInt32LE() >>> 0;
      this.decoded = { merge: { scanInfoArr: { totalBeacons: e2, scanSeqNum: t2 } } };
    } else this.decoded = { totalBeacons: this.typeBufferReader.readUInt16LE(), scanSeqNum: this.typeBufferReader.readUInt32LE() };
  }
  static extractPayload(e2) {
    return e2.readBuffer(6);
  }
}, class DT88 extends BaseDataType {
  constructor(e2, t2) {
    super(e2, t2), this.dataId = "DT88", this.debug;
  }
  decodeBuffer() {
    const e2 = this.typeBufferReader.readBigUIntLE(8), t2 = this.typeBufferReader.readBigUIntLE(8), r2 = this.typeBufferReader.readUInt16LE(), _2 = this.typeBufferReader.readUInt8();
    this.decoded = { imei: e2.toString(), simIccMsd: t2.toString(), simIccLsd: r2, simIccDigits: _2 };
  }
  static extractPayload(e2) {
    return e2.readBuffer(19);
  }
}, class DT89 extends BaseDataType {
  constructor(e2, t2) {
    super(e2, t2), this.dataId = "DT89", this.debug;
  }
  decodeBuffer() {
    const e2 = { BLEGateway: { 0: "NONE", 1: "APP_RESET_CELLULAR", 2: "APP_RESET_COMMAND", 3: "APP_RESET_CELL_SLEEP_FAILURE", 4: "APP_RESET_FIRMWARE_IMAGE_CONFIRMED", 5: "APP_RESET_WATCHDOG_COMM_THREAD", 6: "APP_RESET_WATCHDOG_SENSOR_THREAD", 7: "APP_RESET_WATCHDOG_VIAANIX_THREAD", 8: "APP_RESET_WATCHDOG_CELL_THREAD", 9: "APP_RESET_WATCHDOG_FILE_TX_THREAD", 10: "APP_RESET_WATCHDOG_EXT_MEM_THREAD" }, LocationHub: { 0: "APP_RESET_NONE", 1: "APP_RESET_BUTTON", 2: "APP_RESET_COMMAND", 3: "APP_RESET_FUOTA_FAIL_PERMANENT_MARK", 4: "APP_RESET_FUOTA_FAIL_ROLLBACK", 5: "APP_RESET_FUOTA_REQUEST_UPDATE", 6: "APP_RESET_LORAWAN_SYNC_TIMEOUT", 7: "APP_RESET_FIRMWARE_IMAGE_CONFIRMED", 100: "APP_RESET_WATCHDOG_THREAD_LORAWAN_COMM", 101: "APP_RESET_WATCHDOG_THREAD_COMM_HANDLER", 102: "APP_RESET_WATCHDOG_THREAD_OTA", 103: "APP_RESET_WATCHDOG_THREAD_SCAN", 104: "APP_RESET_WATCHDOG_THREAD_APP", 105: "APP_RESET_WATCHDOG_THREAD_UART_RX", 106: "APP_RESET_WATCHDOG_THREAD_UART_TX" }, MCU: { 0: "NRF52840_RESET_REASON_RESETPIN", 1: "NRF52840_RESET_REASON_WATCHDOG", 2: "NRF52840_RESET_REASON_SOFTRESET", 3: "NRF52840_RESET_REASON_LOCKUP", 4: "NRF52840_RESET_REASON_GPIO", 5: "NRF52840_RESET_REASON_LPCOMP", 6: "NRF52840_RESET_REASON_DEBUG", 7: "NRF52840_RESET_REASON_NFC", 8: "NRF52840_RESET_REASON_VBUS", 9: "NRF52840_RESET_REASON_PWRON" }, BLG: { 0: "NONE", 1: "APP_FATAL_ERROR", 2: "APP_RTOS_NOT_SLEEPING", 3: "APP_RESET_LORAWAN_NOT_JOINED", 4: "APP_RESET_WATCHDOG", 5: "APP_RESET_COMMAND" }, SPBGateway: { 0: "NONE", 1: "APP_RESET_CELLULAR", 2: "APP_RESET_COMMAND", 3: "APP_RESET_CELL_SLEEP_FAILURE", 4: "APP_RESET_FIRMWARE_IMAGE_CONFIRMED", 5: "APP_RESET_WATCHDOG_COMM_THREAD", 6: "APP_RESET_WATCHDOG_SENSOR_THREAD", 7: "APP_RESET_WATCHDOG_VIAANIX_THREAD", 8: "APP_RESET_WATCHDOG_CELL_THREAD", 9: "APP_RESET_WATCHDOG_FILE_TX_THREAD", 10: "APP_RESET_WATCHDOG_EXT_MEM_THREAD" }, "VX-0056": { 0: "APP_RESET_NONE", 1: "APP_RESET_COMMAND", 2: "APP_RESET_FUOTA_FAIL_PERMANENT_MARK", 3: "APP_RESET_FUOTA_FAIL_ROLLBACK", 4: "APP_RESET_FUOTA_REQUEST_UPDATE", 5: "APP_RESET_FIRMWARE_IMAGE_CONFIRMED", 6: "APP_RESET_TIMEOUT_ON_LORADEVICE_READY", 7: "APP_RESET_TIMEOUT_ON_LORADEVICE_START", 8: "APP_RESET_MONITOR_DISCONECT_TIMEOUT", 100: "APP_RESET_WATCHDOG_THREAD_LORAWAN_COMM", 101: "APP_RESET_WATCHDOG_THREAD_COMM_HANDLER", 102: "APP_RESET_WATCHDOG_THREAD_OTA", 103: "APP_RESET_WATCHDOG_THREAD_APP" } };
    this.decoded = { totalResetCount: this.typeBufferReader.readUInt32LE(), appResetReason: e2[this.deviceType][this.typeBufferReader.readUInt8()], mcuResetReason: e2.MCU[this.typeBufferReader.readUInt8()] };
  }
  static extractPayload(e2) {
    return e2.readBuffer(6);
  }
}, class DT90 extends BaseDataType {
  constructor(e2) {
    super(e2), this.dataId = "DT90", this.debug;
  }
  decodeBuffer() {
    this.decoded = { pins: [this.typeBufferReader.readBits(), this.typeBufferReader.readBits(), this.typeBufferReader.readBits(), this.typeBufferReader.readBits()] };
  }
  static extractPayload(e2) {
    return e2.readBuffer(4);
  }
}, class DT99 extends BaseDataType {
  constructor(e2, t2) {
    super(e2, t2), this.dataId = "DT99", this.debug;
  }
  decodeBuffer() {
    const e2 = this.typeBufferReader.readUInt8(), t2 = this.typeBufferReader.readUInt16LE(), r2 = this.typeBufferReader.readUInt16LE();
    this.decoded = { facilityCode: e2, cardPin: t2, keypadPin: r2 };
  }
  static extractPayload(e2) {
    return e2.readBuffer(5);
  }
}, class DT101 extends BaseDataType {
  constructor(e2, t2) {
    super(e2, t2), this.dataId = "DT101", this.debug;
  }
  decodeBuffer() {
    const e2 = this.typeBufferReader.readHex(6), t2 = 0 | this.typeBufferReader.readUInt16BE(), r2 = this.typeBufferReader.readUInt32BE() >>> 0, _2 = 0 | this.typeBufferReader.readInt8(), a = 0 | this.typeBufferReader.readUInt8();
    this.decoded = { merge: { beaconsArr: { vdui: e2, batteryVoltage: t2, sequenceNumber: r2, rssi: _2, antennaType: a } } };
  }
  static extractPayload(e2) {
    return e2.readBuffer(14);
  }
}, class DT104 extends BaseDataType {
  constructor(e2, t2) {
    super(e2, t2), this.dataId = "DT104", this.debug;
  }
  decodeBuffer() {
    const e2 = this.typeBufferReader.readUInt8(), t2 = [];
    for (let r2 = 0; r2 < e2; r2++) t2.push(this.typeBufferReader.readUInt16LE());
    this.decoded = { numChannels: e2, channels: t2 };
  }
  static extractPayload(e2) {
    const t2 = 1 + 2 * e2.buffer.readUInt8(e2.offset);
    return e2.readBuffer(t2);
  }
}, class DT108 extends BaseDataType {
  constructor(e2, t2) {
    super(e2, t2), this.dataId = "DT108", this.debug;
  }
  decodeBuffer() {
    const e2 = this.typeBufferReader.readUInt32LE(), t2 = this.typeBufferReader.readInt8(), r2 = this.typeBufferReader.readUInt8();
    this.decoded = { operator: e2, rssi: t2, ber: r2 };
  }
  static extractPayload(e2) {
    return e2.readBuffer(6);
  }
}, class DT110 extends BaseDataType {
  constructor(e2, t2) {
    super(e2, t2), this.dataId = "DT110", this.debug;
  }
  decodeBuffer() {
    const e2 = this.typeBufferReader.readUInt16LE(), t2 = this.typeBufferReader.readUInt16LE(), r2 = this.typeBufferReader.readUInt16LE(), _2 = this.typeBufferReader.readUInt32LE(), a = 1 === this.typeBufferReader.readUInt8(), n = this.typeBufferReader.readUInt8();
    this.decoded = { merge: { nodesArr: { nodeNumber: n, fwVersion: `${e2}.${t2}.${r2}`, gitHash: _2.toString(16).padStart(8, "0"), isDirty: a } } };
  }
  static extractPayload(e2) {
    return e2.readBuffer(12);
  }
}, class DT114 extends BaseDataType {
  constructor(e2) {
    super(e2), this.dataId = "DT114", this.debug;
  }
  decodeBuffer() {
    const e2 = this.typeBufferReader.readInt16LE(), t2 = this.typeBufferReader.readInt8(), r2 = this.typeBufferReader.readUInt8(), _2 = this.typeBufferReader.readUInt8();
    this.decoded = { rssi: e2, snr: t2, dr: r2, score: _2 };
  }
  static extractPayload(e2) {
    return e2.readBuffer(5);
  }
}]), _ = { "OS Check-In": "OS" };
function decodeUplink(e2) {
  const t2 = [2, 4];
  if (e2?.fPort && !t2.includes(e2.fPort)) return { data: { error: `Incorrect Fport. Received: ${e2.fPort}, allowed fports: ${t2.join(", ")}.`, bytes: e2.bytes, fPort: e2.fPort } };
  const a = function payloadToBuffer(e3) {
    let t3;
    return t3 = function isTypeHex(e4) {
      return !!/^[0-9a-fA-F]+$/.test(e4);
    }(e3) ? Buffer.from(e3, "hex") : Buffer.from(e3, "base64"), t3;
  }(e2.bytes), n = a.toString("hex"), E = new BufferReader(a), s = 192 & a[0], O = function chunkBits(e3, t3, r2 = false) {
    const _2 = [];
    for (let a2 = 0; a2 < e3.length; a2 += t3) {
      const n2 = e3.slice(a2, a2 + t3);
      r2 ? _2.push(n2.reverse().join("")) : _2.push(n2.join(""));
    }
    return _2;
  }(E.readBits().reverse(), 2, false), f = _[function decodeLoRaWANCheckIn(e3) {
    return { "00": "OS Check-In", "01": "Application Check-In", 10: "Event Driven Check-In", 11: "Reserved" }[e3[2]] ?? "unknown";
  }(O)] ?? "APP", d = function decodeDeviceType(e3) {
    return { "01": "BLE Keychain", "02": "BLE ID Card", "03": "BLE Beacon M", "04": "BLE Beacon XL-M", "05": "BLE Beacon S", "06": "BLE Beacon XL-S", "07": "BLG Beacon", "08": "BLG", "09": "LORA Beacon", "0a": "LocationHub", "0b": "VX-0056", "0c": "VX-0057", "0d": "SPBGateway" }[e3] ?? "unknown";
  }(E.readHex(1));
  let T = null, o = null;
  128 === s && (T = E.readUInt32LE(), o = 1e3 * E.readUInt32LE());
  const R = function decodeBuffer(e3, t3, r2) {
    const _2 = [];
    function processDataType(r3) {
      const _3 = r3.extractPayload(e3);
      return new r3(_3, t3).processBuffer();
    }
    for (isDebug(); e3.hasNextByte(); ) {
      const t4 = e3.readInt8().toString();
      if (isDebug(), r2 instanceof Map && r2.has(t4)) _2.push(processDataType(r2[t4].class));
      else {
        if (!(t4 in r2)) throw new DataTypeNotFound(t4, e3.buffer);
        _2.push(processDataType(r2[t4].class));
      }
    }
    let a2 = {};
    return _2.forEach((e4) => {
      e4?.merge ? Object.keys(e4.merge).forEach((t4) => {
        a2[t4] || (a2[t4] = []);
        const r3 = e4.merge[t4];
        "scanInfoArr" === t4 && (r3._beaconIndex = (a2.beaconsArr || []).length), a2[t4].push(r3);
      }) : a2 = { ...a2, ...e4 };
    }), a2;
  }(E, d, r), A = ((e3) => {
    const t3 = [function vduiUpper(e4, t4) {
      return "vdui" === e4 && "string" == typeof t4 ? t4.toUpperCase() : t4;
    }];
    function travelDecoded(e4, t4) {
      return "object" != typeof e4 || null === e4 ? e4 : Object.fromEntries(Object.entries(e4).map(([e5, r2]) => "string" == typeof r2 ? [e5, t4(e5, r2)] : Array.isArray(r2) ? [e5, r2.map((e6) => travelDecoded(e6, t4))] : "object" == typeof r2 ? [e5, travelDecoded(r2, t4)] : [e5, r2]));
    }
    for (const r2 of t3) e3 = travelDecoded(e3, r2);
    return e3;
  })({ checkInType: f, ...null !== T && { sn: T }, ...null !== o && { ts: o }, ...R }), i = function separateBeaconsByAntenna(e3) {
    const { scanInfoArr: t3, beaconsArr: r2, SPBGateway_appLogic: _2, ...a2 } = e3;
    if (!r2) return e3;
    if (!((t3?.length ?? 0) >= 2 && t3[0]?.scanSeqNum !== t3[1]?.scanSeqNum)) {
      const e4 = t3?.[0] ?? null;
      return { ...a2, ..._2 && { SPBGateway_appLogic: _2 }, scanSeqNum: e4?.scanSeqNum ?? null, totalBeacons: e4?.totalBeacons ?? r2.length, beaconsArr: r2 };
    }
    const n2 = t3[0], E2 = t3[1], s2 = E2._beaconIndex ?? r2.length, O2 = r2.slice(0, s2), f2 = r2.slice(s2), d2 = _2 || [];
    return { messages: [{ ...a2, ...d2[0] && { SPBGateway_appLogic: [d2[0]] }, scanSeqNum: n2?.scanSeqNum ?? null, totalBeacons: n2?.totalBeacons ?? O2.length, beaconsArr: O2 }, { ...a2, ...d2[1] && { SPBGateway_appLogic: [d2[1]] }, scanSeqNum: E2?.scanSeqNum ?? null, totalBeacons: E2?.totalBeacons ?? f2.length, beaconsArr: f2 }] };
  }(A);
  return { data: { payloadHex: n, ...i } };
}

