"use strict";

var MIDIMessage = require('../dist/index.js'); //eslint-disable-line

if (navigator.requestMIDIAccess){
	navigator.requestMIDIAccess().then( onMIDIInit, onMIDIReject );
}
else{
	console.error("DOH! No MIDI support present in your browser.");
}

function onMIDIInit (midi){
	// midi.inputs
	// midi.onstatechange
	// midi.outputs
	// midi.sysexEnabled
	console.log("Successfully Initialized MIDI");
	var foundString = "Found " + midi.inputs.size + " inputs and " + midi.outputs.size + " outputs.";
	console.log(foundString);
	console.log("Sysex is", midi.sysexEnabled ? "enabled" : "disabled");
	onMIDIConect(midi);


	midi.onstatechange = function(event){
		console.log("MIDIConnectionEvent on port", event.port);
		if (event.port.type === "input" && event.port.connection === "open"){
			onMIDIConect(midi);
		}
	}
}

function onMIDIConect(midi){

	midi.inputs.forEach(function(input){
		console.log("Input id:", input.id, input);
		input.onmidimessage = function(event){
			var midiMessage = MIDIMessage(event);
			console.log("Parsed", midiMessage);
		}
	});
}

function onMIDIReject (error){
	console.error(error);
	return;
}
