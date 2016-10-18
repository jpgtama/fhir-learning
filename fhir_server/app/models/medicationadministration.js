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

var MedicationAdministrationSchema = new mongoose.Schema({
	resourceType: String,
	id: String,
	meta:{
		versionId: String,
		lastUpdated: String
	},
    identifier: [{
        use: String,
        label: String,
        system: String,
        value: String
    }],
    status: String,
    patient: {
		reference: String,
		display: String
    },
    practitioner: {
		reference: String,
		display: String
    },
    encounter: {
		reference: String,
		display: String
    },
    prescription: {
		reference: String,
		display: String
    },
    wasNotGiven: Boolean,
    reasonNotGiven: [{
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    }],
    reasonGiven: [{
        coding: [{
            system: String,
            code: String,
            display: String,
			version: String,
			userSelected: Boolean
        }],
		text: String
    }],
	effectiveTime:{
		effectiveTimeDateTime: Date,
		effectiveTimePeriod: {
			start: String,
			end: String
		}
	},
	medicationCodeableConcept:{
		coding: [{
			system: String,
			code: String,
			display: String,
			version: String,
			userSelected: Boolean
		}],
		text: String
	},
	medicationReference: {
		reference: String,
		display: String
	},
    device: [{
		reference: String,
		display: String
    }],
    note: String,
    dosage: {
        text: String,
		siteCodeableConcept: {
			coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
		},
		siteReference: {
			reference: String,
			display: String
		},
        route: {
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        },
        method: {
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        },
        quantity: {
			value: Number,
			comparator: String,
			unit: String,
			system: String,
			code: String
        },
		rateRatio: {
			numerator:{
				value: Number,
				comparator: String,
				unit: String,
				system: String,
				code: String
			},
			denominator: {
				value: Number,
				comparator: String,
				unit: String,
				system: String,
				code: String
			}
		},
		rateRange: {
			low: {
				value: Number,
				comparator: String,
				unit: String,
				system: String,
				code: String
			},
			high:{
				value: Number,
				comparator: String,
				unit: String,
				system: String,
				code: String
			}
		}
    }
},{collection: "MedicationAdministration"});

mongoose.model('MedicationAdministration', MedicationAdministrationSchema);
