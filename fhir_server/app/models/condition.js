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

var ConditionSchema = new mongoose.Schema({
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
    patient: {
		reference: String,
		display: String
    },
    encounter: {
		reference: String,
		display: String
    },
    asserter: {
		reference: String,
		display: String
    },
    dateRecorded: String,
    code: {
        coding: [{
            system: String,
            code: String,
            display: String,
			version: String,
			userSelected: Boolean
        }],
		text: String
    },
    category: {
        coding: [{
            system: String,
            code: String,
            display: String,
			version: String,
			userSelected: Boolean
        }],
		text: String
    },
    clinicalStatus: String,
    verificationStatus: String,
    severity: {
        coding: [{
            system: String,
            code: String,
            display: String,
			version: String,
			userSelected: Boolean
        }],
		text: String
    },
    onsetDateTime: Date,
    onsetPeriod: {
		start: Date,
		end: Date
    },
    onsetRange: {
		low: {
			value: Number,
			comparator: String,
			unit: String,
			system: String,
			code: String
		},
		high: {
			value: Number,
			comparator: String,
			unit: String,
			system: String,
			code: String
		}
    },
    onsetString: String,
    abatementDateTime: Date,
    abatementBoolean: Boolean,
    abatementPeriod: {
		start: Date,
		end: Date
    },
    abatementRange: {
		low: {
			value: Number,
			comparator: String,
			unit: String,
			system: String,
			code: String
		},
		high: {
			value: Number,
			comparator: String,
			unit: String,
			system: String,
			code: String
		}
    },
    abatementString: String,
    stage: {
        summary: {
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        },
        assessment: [{
			reference: String,
			display: String
        }]
    },
    evidence: [{
        code: {
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        },
        detail: [{
			reference: String,
			display: String
        }]
    }],
    bodySite: [{
        coding: [{
			system: String,
			code: String,
			display: String,
			version: String,
			userSelected: Boolean
		}],
		text: String
    }],
    notes: String,
},{collection: "Condition"});

mongoose.model('Condition', ConditionSchema);
