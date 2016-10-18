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

var EncounterSchema = new mongoose.Schema({
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
    statusHistory: [{
        status: String,
        period: {
			start: Date,
			end: Date
        }
    }],
    class: String,
    type: [{
        coding: [{
            system: String,
            code: String,
            display: String,
			version: String,
			userSelected: Boolean
        }],
		text: String
    }],
    priority: {
        coding: [{
            system: String,
            code: String,
            display: String,
			version: String,
			userSelected: Boolean
        }],
		text: String
    },
    patient: {
		reference: String,
		display: String
    },
    episodeOfCare: [{
		reference: String,
		display: String
    }],
    incomingReferral: [{
		reference: String,
		display: String
    }],
    participant: [{
        $type: [{
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        }],
        period: {
			start: Date,
			end: Date
        },
        individual: {
			reference: String,
			display: String
        }
    }],
    appointment: {
		reference: String,
		display: String
    },
    period: {
		start: String,
		end: String
    },
    length: {
		value: Number,
		comparator: String,
		unit: String,
		system: String,
		code: String
    },
    reason: [{
        coding: [{
			system: String,
			code: String,
			display: String,
			version: String,
			userSelected: Boolean
		}],
		text: String
    }],
    indication: [{
		reference: String,
		display: String
    }],
    hospitalization: {
        preAdmissionIdentifier: {
            use: String,
            label: String,
            system: String,
            value: String
        },
        origin: {
			reference: String,
			display: String
        },
        admitSource: {
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        },
        admittingDiagnosis: [{
			reference: String,
			display: String
        }],
        reAdmission: {
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        },
        dietPreference: [{
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        }],
        specialCourtesy: [{
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        }],
        specialArrangement: [{
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        }],
        destination: {
			reference: String,
			display: String
        },
        dischargeDisposition: {
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        },
        dischargeDiagnosis: [{
			reference: String,
			display: String
        }]
    },
    location: [{
        location: {
			reference: String,
			display: String
        },
        status: String,
        period: {
			start: Date,
			end: Date
        }
    }],
    serviceProvider: {
		reference: String,
		display: String
    },
    partOf: {
		reference: String,
		display: String
    }
}, {collection: "Encounter"});

mongoose.model('Encounter', EncounterSchema);
