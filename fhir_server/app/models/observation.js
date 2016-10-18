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

var ObservationSchema = new mongoose.Schema({
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
    category: {
        coding: [{
			system: String,
			version: String,
			code: String,
			display: String,
			userSelected: Boolean
		}],
		text: String
    },
    code: {
        coding: [{
			system: String,
			version: String,
			code: String,
			display: String,
			userSelected: Boolean
		}],
		text: String
    },
    subject: {
		display: String,
		reference: String
    },
    encounter: {
		display: String,
		reference: String
    },
    effectiveDateTime: String,
    effectivePeriod: {
		start: String,
		end: String
    },
    issued: String,
    performer: [{
		display: String,
		reference: String
    }],
    valueQuantity: {
        value: String,
		comparator: String,
        unit: String,
        system: String,
        code: String
    },
    valueCodeableConcept: {
        coding: [{
			system: String,
			version: String,
			code: String,
			display: String,
			userSelected: Boolean
		}],
		text: String
    },
    valueString: String,
    valueRange: {
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
    valueRatio: {
		numerator:{
			value: Number,
			comparator: String,
			unit: String,
			system: String,
			code: String
		},
		denominator:{
			value: Number,
			comparator: String,
			unit: String,
			system: String,
			code: String
		}
    },
    valueSampledData: {
		origin:{
			value: Number,
			comparator: String,
			unit: String,
			system: String,
			code: String
		},
		period: Number,
		factor: Number,
		lowerLimit: Number,
		upperLimit: Number,
		dimensions: Number,
		data: String
    },
    valueAttachment: {
    },
    valueTime: {
    },
    valueDateTime: String,
    valuePeriod: {
		start: String,
		end: String
    },
    dataAbsentReason: {
        coding: [{
			system: String,
			version: String,
			code: String,
			display: String,
			userSelected: Boolean
		}],
		text: String
    },
    interpretation: {
        coding: [{
			system: String,
			version: String,
			code: String,
			display: String,
			userSelected: Boolean
		}],
		text: String
    },
    comments: String,
    bodySite: {
        coding: [{
			system: String,
			version: String,
			code: String,
			display: String,
			userSelected: Boolean
		}],
		text: String
    },
    method: {
        coding: [{
			system: String,
			version: String,
			code: String,
			display: String,
			userSelected: Boolean
		}],
		text: String
    },
    specimen: {
		reference: String,
		display: String
    },
    device: {
		reference: String,
		display: String
    },
    referenceRange: [{
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
        },
        meaning: {
            coding: [{
				system: String,
				version: String,
				code: String,
				display: String,
				userSelected: Boolean
			}],
			text: String
        },
        age: {
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
        text: String,
    }],
    related: [{
        type: String,
        target: {
			reference: String,
			display: String
        }
    }],
    component: [{
        code: {
            coding: [{
				system: String,
				version: String,
				code: String,
				display: String,
				userSelected: Boolean
			}],
			text: String
        },
        valueQuantity: {
            value: String,
			comparator: String,
            units: String,
            system: String,
            code: String
        },
        valueCodeableConcept: {
            coding: [{
				system: String,
				version: String,
				code: String,
				display: String,
				userSelected: Boolean
			}],
			text: String
        },
        valueString: String,
        valueRange: {
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
        valueRatio: {
        },
        valueSampledData: {
			origin:{
				value: Number,
				comparator: String,
				unit: String,
				system: String,
				code: String
			},
			period: Number,
			factor: Number,
			lowerLimit: Number,
			upperLimit: Number,
			dimensions: Number,
			data: String
        },
        valueAttachment: {
        },
        valueTime: {
        },
        valueDateTime: Date,
        valuePeriod: {
			start: String,
			end: String
        },
        dataAbsentReason: {
            coding: [{
				system: String,
				version: String,
				code: String,
				display: String,
				userSelected: Boolean
			}],
			text: String
        },
        referenceRange: [{
        }]
    }]
}, {collection: "Observation"});

mongoose.model('Observation', ObservationSchema);
