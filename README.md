# Homebridge Remote Transmitter plugin

This is a plugin for [Homebridge](https://github.com/nfarina/homebridge) to allow controlling modern 433MHz receivers like lightbulbs, switches, dimmers, outlets, etc. This plugin is meant to run on Raspberry Pi's (or boards with a similar GPIO setup). It's been tested on the newer KlikAanKlikUit (KaKu) receivers in combination with HomeBridge running on a Raspberry Zero and it works great.

## Installation

```
$ sudo npm install -g homebridge-remote-transmitter
```

## Configuration

First, you need a working Homebridge installation.

Once you have that working, edit `~/.homebridge/config.json` and add a new accessory:

```
"accessories": [
    {
        "accessory": "RemoteTransmitter",
        "name": "Livingroom Light",
        "pin": 7,
        "address": "2",
        "device": "1",
        "service": "Lightbulb",
        "dimmable": true
    }
    {
        "accessory": "RemoteTransmitter",
        "name": "Bedroom Light",
        "pin": 7,
        "address": "3",
        "device": "1",
        "service": "Lightbulb"
    }
]
```

'pin' is the physical GPIO pin that the 433Mhz transmitter is connected to.
