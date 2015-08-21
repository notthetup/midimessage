"use strict";

export default function(event){
	function MIDIMessage (event){
		this._event = event;
		this._data = event.data;
		this.receivedTime = event.receivedTime;

		if (this._data && this._data.length < 2){
			console.warn("Illegal MIDI message of length", this._data.length);
			return;
		}

		this._messageCode = event.data[0] & 0xf0;
		this.channel = event.data[0] & 0x0f;

		switch(this._messageCode){

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

				if (this.controlNumber === 120 && this.controlValue === 0){
					this.channelModeMessage = "allsoundoff";
				}
				else if (this.controlNumber === 121){
					this.channelModeMessage = "resetallcontrollers";
				}
				else if (this.controlNumber === 122){
					if (this.controlValue === 0){
						this.channelModeMessage =  "localcontroloff";
					}else{
						this.channelModeMessage =  "localcontrolon";
					}
				}
				else if (this.controlNumber === 123 && this.controlValue === 0){
					this.channelModeMessage = "allnotesoff";
				}
				else if (this.controlNumber === 124 && this.controlValue === 0){
					this.channelModeMessage = "omnimodeoff";
				}
				else if (this.controlNumber === 125 && this.controlValue === 0){
					this.channelModeMessage = "omnimodeon";
				}
				else if (this.controlNumber === 126){
					this.channelModeMessage = "monomodeon";
				}
				else if (this.controlNumber === 127){
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
}
