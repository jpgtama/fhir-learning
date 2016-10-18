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

var MedicationOrderSchema = new mongoose.Schema({
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
    dateWritten: String,
    status: String,
    dateEnded: String,
    reasonEnded: {
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
    prescriber: {
		reference: String,
		display: String
    },
    encounter: {
		reference: String,
		display: String
    },
	reasonCodeableConcept: {
		coding: [{
			system: String,
			code: String,
			display: String,
			version: String,
			userSelected: Boolean
		}],
		text: String
	},
	reasonReference: {
		reference: String,
		display: String
	},
    note: String,
	medicationCodeableConcept: {
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
    dosageInstruction: [{
        text: String,
        additionalInstructions: {
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        },
        timing: {
			event: [String],
			repeat: {
				boundsQuatity:{
					
				},
				boundsRange:{
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
				},
				boundsPeriod:{
					start: String,
					end: String
				},
				count: Number,
				duration: Number,
				durationMax: Number,
				durationUnits: String,
				frequency: Number,
				frequencyMax: Number,
				period: Number,
				periodMax: Number,
				periodUnit: String,
				when: String
			},
			code:{
				coding: [{
					system: String,
					code: String,
					display: String,
					version: String,
					userSelected: Boolean
				}],
				text: String
			}
        },
		asNeededBoolean: Boolean,
		asNeededCodeableConcept: {
			coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
		},
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
		doseRange: {
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
		},
		doseQuantity: {
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
		},
        maxDosePerPeriod: {
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
        }
    }],
    dispenseRequest: {
		medicationCodeableConcept: {
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
        validityPeriod: {
			start: String,
			end: String
        },
        numberOfRepeatsAllowed: Number,
        quantity: {
			value: Number,
			comparator: String,
			unit: String,
			system: String,
			code: String
        },
        expectedSupplyDuration: {
			value: Number,
			comparator: String,
			unit: String,
			system: String,
			code: String
        }
    },
    substitution: {
        type: {
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        },
        reason: {
            coding: [{
				system: String,
				code: String,
				display: String,
				version: String,
				userSelected: Boolean
			}],
			text: String
        }
    },
    priorPrescription: {
		reference: String,
		display: String
    }
},{collection: "MedicationOrder"});

mongoose.model('MedicationOrder', MedicationOrderSchema);
