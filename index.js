'use strict';
var NRT = require('./lib/NewRemoteTransmitter.js');

var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-remote-transmitter', 'RemoteTransmitter', RTAccessory);
};

function RTAccessory(log, config) {
  
  let address = config.address;
  let device = config.device;
  let pin = config.pin;
  let nrt = NRT(address, pin, 250, 2);
  
  var platform = this;
  this.log = log;
  this.name = config.name;
  this.service = new Service[config.service || 'Outlet'](this.name);

  this.service.getCharacteristic(Characteristic.On)
    .on('set', function(value, callback) {
      var switchOn = value ? true : false
      platform.log(config.name, "switch -> " + switchOn);
      nrt.switchUnit(device, switchOn);
      callback();
  });
  
  if (config.dimmable) {
    this.service.addCharacteristic(Characteristic.Brightness)
      .on('set', function(level, callback) {
      platform.log(config.name, "dim -> " + level);
      nrt.sendDim(device, Math.ceil((level / 100) * 15)); 
      callback();
    });
  }
};

RTAccessory.prototype.getServices = function() {
  return [this.service];
};
