(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.midimessage = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default(event) {
  function MIDIMessage(event) {
    this._event = event;
    this._data = event.data;
    this.receivedTime = event.receivedTime;

    if (this._data && this._data.length < 2) {
      console.warn("Illegal MIDI message of length", this._data.length);
      return;
    }

    this._messageCode = event.data[0] & 0xf0;
    this.channel = (event.data[0] & 0x0f) + 1;

    switch (this._messageCode) {
      // Note Off
      case 0x80:
        this.messageType = "noteoff";
        this.key = event.data[1] & 0x7F;
        this.velocity = event.data[2] & 0x7F;
        break;
      // Note On

      case 0x90:
        this.messageType = "noteon";
        this.key = event.data[1] & 0x7F;
        this.velocity = event.data[2] & 0x7F;
        break;
      // Polyphonic Key Pressure

      case 0xA0:
        this.messageType = "keypressure";
        this.key = event.data[1] & 0x7F;
        this.pressure = event.data[2] & 0x7F;
        break;
      // Control Change

      case 0xB0:
        this.messageType = "controlchange";
        this.controllerNumber = event.data[1] & 0x7F;
        this.controllerValue = event.data[2] & 0x7F;

        if (this.controllerNumber === 120 && this.controllerValue === 0) {
          this.channelModeMessage = "allsoundoff";
        } else if (this.controllerNumber === 121) {
          this.channelModeMessage = "resetallcontrollers";
        } else if (this.controllerNumber === 122) {
          if (this.controllerValue === 0) {
            this.channelModeMessage = "localcontroloff";
          } else {
            this.channelModeMessage = "localcontrolon";
          }
        } else if (this.controllerNumber === 123 && this.controllerValue === 0) {
          this.channelModeMessage = "allnotesoff";
        } else if (this.controllerNumber === 124 && this.controllerValue === 0) {
          this.channelModeMessage = "omnimodeoff";
        } else if (this.controllerNumber === 125 && this.controllerValue === 0) {
          this.channelModeMessage = "omnimodeon";
        } else if (this.controllerNumber === 126) {
          this.channelModeMessage = "monomodeon";
        } else if (this.controllerNumber === 127) {
          this.channelModeMessage = "polymodeon";
        }

        break;
      // Program Change

      case 0xC0:
        this.messageType = "programchange";
        this.program = event.data[1];
        break;
      // Channel Pressure

      case 0xD0:
        this.messageType = "channelpressure";
        this.pressure = event.data[1] & 0x7F;
        break;
      // Pitch Bend Change

      case 0xE0:
        this.messageType = "pitchbendchange";
        var msb = event.data[2] & 0x7F;
        var lsb = event.data[1] & 0x7F;
        this.pitchBend = (msb << 7) + lsb;
        break;
    }
  }

  return new MIDIMessage(event);
}

},{}]},{},[1])(1)
});
