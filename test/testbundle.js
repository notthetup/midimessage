(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (event) {
	function MIDIMessage(event) {
		this._event = event;
		this._data = event.data;
		this.receivedTime = event.receivedTime;

		if (this._data && this._data.length < 2) {
			console.warn("Illegal MIDI message of length", this._data.length);
			return;
		}

		this._messageCode = event.data[0] & 0xf0;
		this.channel = event.data[0] & 0x0f;

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
				this.velocity = event.data[2] & 0x7F;
				break;

			// Control Change
			case 0xB0:
				this.messageType = "controlchange";
				this.controlNumber = event.data[1] & 0x7F;
				this.controlValue = event.data[2] & 0x7F;

				if (this.controlNumber === 120 && this.controlValue === 0) {
					this.channelModeMessage = "allsoundoff";
				} else if (this.controlNumber === 121) {
					this.channelModeMessage = "resetallcontrollers";
				} else if (this.controlNumber === 122) {
					if (this.controlValue === 0) {
						this.channelModeMessage = "localcontroloff";
					} else {
						this.channelModeMessage = "localcontrolon";
					}
				} else if (this.controlNumber === 123 && this.controlValue === 0) {
					this.channelModeMessage = "allnotesoff";
				} else if (this.controlNumber === 124 && this.controlValue === 0) {
					this.channelModeMessage = "omnimodeoff";
				} else if (this.controlNumber === 125 && this.controlValue === 0) {
					this.channelModeMessage = "omnimodeon";
				} else if (this.controlNumber === 126) {
					this.channelModeMessage = "monomodeon";
				} else if (this.controlNumber === 127) {
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
				this.pitchBend = (msb << 8) + lsb;
				break;
		}
	}

	return new MIDIMessage(event);
};

module.exports = exports["default"];

},{}],2:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _srcIndexJs = require('../src/index.js');

var _srcIndexJs2 = _interopRequireDefault(_srcIndexJs);

if (navigator.requestMIDIAccess) {
	navigator.requestMIDIAccess().then(onMIDIInit, onMIDIReject);
} else {
	console.error("DOH! No MIDI support present in your browser.");
}

function onMIDIInit(midi) {
	// midi.inputs
	// midi.onstatechange
	// midi.outputs
	// midi.sysexEnabled
	console.log("Successfully Initialized MIDI");
	var foundString = "Found " + midi.inputs.size + " inputs and " + midi.outputs.size + " outputs.";
	console.log(foundString);
	console.log("Sysex is", midi.sysexEnabled ? "enabled" : "disabled");

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = midi.inputs.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var input = _step.value;

			console.log("Input id:", input.id, input);
			input.onmidimessage = function (event) {
				var midiMessage = (0, _srcIndexJs2["default"])(event);
				console.log("Parsed", midiMessage);
			};
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator["return"]) {
				_iterator["return"]();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = midi.outputs.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var output = _step2.value;

			console.log("Output id:", output.id, output);
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
				_iterator2["return"]();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	midi.onstatechange = function (event) {
		console.log("MIDIConnectionEvent on port", event.port);
	};
}

function onMIDIReject(error) {
	console.error(error);
	return;
}

},{"../src/index.js":1}]},{},[2]);
