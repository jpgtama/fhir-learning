// Copyright (c) 2011+, HL7, Inc & The MITRE Corporation
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without modification, 
// are permitted provided that the following conditions are met:
// 
//     * Redistributions of source code must retain the above copyright notice, this 
//       list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright notice, 
//       this list of conditions and the following disclaimer in the documentation 
//       and/or other materials provided with the distribution.
//     * Neither the name of HL7 nor the names of its contributors may be used to 
//       endorse or promote products derived from this software without specific 
//       prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
// IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
// NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR 
// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
// POSSIBILITY OF SUCH DAMAGE.

var mongoose = require('mongoose');

var PatientSchema = new mongoose.Schema({
	resourceType: String,
	id: String,
	meta:{
		versionId: String,
		lastUpdated: String
	},
	identifier: [{
		use: String,
		// type: {
			// coding: [{
				// system: String,
				// version: String,
				// code: String,
				// display: String,
				// userSelected: Boolean
			// }],
			// text: String
		// },
		system: String,
		value: String
	}],
	active: Boolean,
	name: [{
		use: String,
		text: String,
		family: [String],
		given: [String],
		prefix: [String],
		suffix: [String]
	}],
	telecom: [{
		system:String,
		value:String,
		use:String,
		rank:Number,
		period:{
			start: String,
			end: String
		}
	}],
	gender: String,
	birthDate: String,
	deceasedBoolean: Boolean,
	deceasedDateTime: Date,
	address: [{
		use: String,
		type: String,
		text: String,
		line: String,
		city: String,
		distinct: String,
		state: String,
		postalCode: String,
		country: String,
		period: {
			start: String,
			end: String
		}
	}],
	maritalStatus: {
		coding: [{
			system: String,
			code: String,
			display: String
		}]
	},
	multipleBirthBoolean: Boolean,
	multipleBirthInteger: Number,
	photo: [{
		data: String,
		contentType: String
	}],
	contact: [{
		relationship: [{
			coding: [{
				system: String,
				code: String,
				display: String
			}]
		}],
		name: {
			use: String,
			text: String,
			family: [String],
			given: [String],
			prefix: [String],
			suffix: [String]
		},
		telecom: [{
			resourceType: String,
			system: String,
			value: String,
			use: String,
			rank: Number,
			period: {
				start: Date,
				end: Date
			}
		}],
		address: [{
			resourceType: String,
			use: String,
			type: String,
			text: String,
			line: [String],
			city: String,
			district: String,
			state: String,
			postalCode: String,
			country: String,
			period: {
				start: Date,
				end: Date
			}
		}],
		gender: String,
		organization: {
			display: String,
			reference: String
		},
		period: {
			start: String,
			end: String
		}
	}],
	animal: {
		species: {
			coding: [{
				system: String,
				code: String,
				display: String
			}]
		},
		breed: {
			coding: [{
				system: String,
				code: String,
				display: String
			}]
		},
		genderStatus: {
			coding: [{
				system: String,
				code: String,
				display: String
			}]
		}
	},
	communication: [{
		language: {
			coding: [{
				system: String,
				code: String,
				display: String
			}]
		},
		preferred: Boolean,
	}],
	careProvider: [{
		display: String,
		reference: String
	}],
	managingOrganization: {
		display: String,
		reference: String
	},
	link: [{
		other: {
			reference: String,
			display:String
		},
		type: String,
	}],
	text:{
		status: String,
		div: String
	}
},{collection: "Patient"});

mongoose.model('Patient', PatientSchema);
