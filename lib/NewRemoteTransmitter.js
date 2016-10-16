'use strict';
const rpio = require('rpio');

class NewRemoteTransmitter {

  constructor(address, pin, periodusec, repeats) {
    this._address    = address;
    this._pin        = pin;
    this._periodusec = periodusec;
    this._repeats    = (1 << repeats) - 1;

    rpio.open(this._pin, rpio.OUTPUT, rpio.LOW);
  }
  
  sendGroup(switchOn) {
    for (let i = this._repeats; i >= 0; i--) {
      this.sendStartPulse();
      this.sendAddress();
      // Do send group bit
      this.sendBit(true);
      // Switch on | off
      this.sendBit(switchOn);
      // No unit. Is this actually ignored?..
      this.sendUnit(0);
      this.sendStopPulse();
    }
  }
  
  switchUnit(unit, switchOn) {
    for (let i = this._repeats; i >= 0; i--) {
      this.sendStartPulse();  
      this.sendAddress();
      this.sendBit(false);
      // Switch on | off
      this.sendBit(switchOn);
      
      this.sendUnit(unit);
      this.sendStopPulse();
    }
  }
  
  sendDim(unit, dimLevel) {
    for (let i = this._repeats; i >= 0; i--) {
      this.sendStartPulse();
      this.sendAddress();
      this.sendBit(false);
      
      // Switch type 'dim'
      rpio.write(this._pin, rpio.HIGH);
      rpio.usleep(this._periodusec);
      rpio.write(this._pin, rpio.LOW);
      rpio.usleep(this._periodusec);
      rpio.write(this._pin, rpio.HIGH);
      rpio.usleep(this._periodusec);
      rpio.write(this._pin, rpio.LOW);
      rpio.usleep(this._periodusec);

      this.sendUnit(unit);

      for (let j = 3; j >= 0; j--) {
        this.sendBit(dimLevel & 1 << j);
      }

      this.sendStopPulse();
    }
  }
  
  sendStartPulse() {
    rpio.write(this._pin, rpio.HIGH);
    rpio.usleep(this._periodusec);
    rpio.write(this._pin, rpio.LOW);
    rpio.usleep(this._periodusec * 10 + (this._periodusec >> 1)); // Actually 10.5T insteat of 10.44T. Close enough.
  }
  
  sendAddress() {
    for (let i = 25; i >= 0; i--) {
      this.sendBit((this._address >> i) & 1);
    }
  }
  
  sendUnit(unit) {
    for (let i = 3; i >= 0; i--) {
      this.sendBit(unit & 1 << i);
    }
  }
  
  sendStopPulse() {
    rpio.write(this._pin, rpio.HIGH);
    rpio.usleep(this._periodusec);
    rpio.write(this._pin, rpio.LOW);
    rpio.usleep(this._periodusec * 40);
  }
  
  sendBit(isBitOne) {
    if (isBitOne) {
      // Send '1'
      rpio.write(this._pin, rpio.HIGH);
      rpio.usleep(this._periodusec);
      rpio.write(this._pin, rpio.LOW);
      rpio.usleep(this._periodusec * 5);
      rpio.write(this._pin, rpio.HIGH);
      rpio.usleep(this._periodusec);
      rpio.write(this._pin, rpio.LOW);
      rpio.usleep(this._periodusec);
    } else {
      // Send '0'
      rpio.write(this._pin, rpio.HIGH);
      rpio.usleep(this._periodusec);
      rpio.write(this._pin, rpio.LOW);
      rpio.usleep(this._periodusec);
      rpio.write(this._pin, rpio.HIGH);
      rpio.usleep(this._periodusec);
      rpio.write(this._pin, rpio.LOW);
      rpio.usleep(this._periodusec * 5);
    }
  }

}

module.exports = (address, pin, periodusec, repeats) => {
  return new NewRemoteTransmitter(address, pin, periodusec, repeats);
}
