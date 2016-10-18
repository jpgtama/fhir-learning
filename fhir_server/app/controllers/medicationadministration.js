// Copyright (c) 2011+, HL7, Inc & The MITRE Corporation
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without modification, 
// are permitted provided that the following conditions are met:
// 
//  * Redistributions of source code must retain the above copyright notice, this 
//    list of conditions and the following disclaimer.
//  * Redistributions in binary form must reproduce the above copyright notice, 
//    this list of conditions and the following disclaimer in the documentation 
//    and/or other materials provided with the distribution.
//  * Neither the name of HL7 nor the names of its contributors may be used to 
//    endorse or promote products derived from this software without specific 
//    prior written permission.
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
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var MedicationAdministration = mongoose.model('MedicationAdministration');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
	if(next){
			MedicationAdministration.findOne({id: 'MedicationAdministration/' + id, "meta.versionId": vid}, function(err, foundMedicationadministration) {
				if (!err) {
					if(!foundMedicationadministration) {
						res.sendStatus(404);
					} else {
						req.medicationadministration = foundMedicationadministration;
					    next(foundMedicationadministration);
					}
					
				} else {
					res.sendStatus(404);
				}	
			});
		} else {
			// Four arguments, so vid becomes next
			next = vid;
			ResourceHistory.findOne({resourceId: 'MedicationAdministration/' + id}, function(rhErr, resourceHistory) {
				if (rhErr) {
					next(rhErr);
				}
				if(resourceHistory !== null) {
					req.resourceHistory = resourceHistory;
					req.resourceHistory.findLatest(function(err, medicationadministration) {
						req.medicationadministration = medicationadministration;
						next(medicationadministration);
					});
				}
				else{
					res.sendStatus(404);
				}	
			});
		}
};


exports.show = function(req, res) {
  var medicationadministration = req.medicationadministration;
  var json = JSON.stringify(medicationadministration);
  res.send(json);
};

exports.create = function(req, res) {
	var medicationadministration = new MedicationAdministration(req.body);
	ResourceHistory.find({resourceType: 'MedicationAdministration'}, function(rhErr, pat) {
		var count = pat.length + 1;
		MedicationAdministration.id = 'MedicationAdministration/' + count;
		MedicationAdministration.meta = {
			versionId: 1,
			lastUpdated: new Date(Date.now())
		};
		medicationadministration.save(function(err, savedMedicationadministration) {
			if(err) {
				console.log(err);
				res.sendStatus(500);
			} else {
				var resourceHistory = new ResourceHistory({resourceType: 'MedicationAdministration'});
				resourceHistory.addVersion(savedMedicationadministration.id, savedMedicationadministration.meta.versionId);
				resourceHistory.save(function(rhErr, savedResourceHistory){
					if (rhErr) {
					  res.sendStatus(500);
					} else {
					  var content = {"status":"created",
					                 "id":savedMedicationadministration.id};
					  res.send(JSON.stringify(content));
					}
				});
			}
		});
	});
};

exports.update = function(req, res) {
	var medicationadministration = _.extend(req.medicationadministration, req.body);
	var objectMedicationadministration = medicationadministration.toObject();
	delete objectMedicationadministration._id;
	objectMedicationadministration.id = 'MedicationAdministration/' + req.params.id;
	objectMedicationadministration.meta = {
		versionId : parseInt(req.resourceHistory.vistaId) + 1,
		lastUpdated : new Date(Date.now())
	};
	var medicationadministrationModel = new MedicationAdministration(objectMedicationadministration);
	medicationadministrationModel.save(function (err, savedMedicationadministration) {
		if (err) {
			res.sendStatus(500);
		} else {
			var resourceHistory = req.resourceHistory;
			resourceHistory.addVersion(savedMedicationadministration.id, savedMedicationadministration.meta.versionId);
			resourceHistory.save(function (rhErr, savedResourceHistory) {
				if(rhErr) {
					res.sendStatus(500);
				} else {
					res.sendStatus(200);
				}
			});
		}

	});
};

exports.destroy = function(req, res) {
	var medicationadministrationId = "MedicationAdministration/" + req.params.id;
	MedicationAdministration.find({id:medicationadministrationId}).remove(function (err) {
		if (err) {
			res.sendStatus(500);
		} else {
			ResourceHistory.findOne({resourceId: medicationadministrationId}, function(rhErr, resourceHistory) {
				if (resourceHistory) {
					resourceHistory.deleted = true;
					resourceHistory.save(function (rhErr, savedResourceHistory) {
						if(rhErr) {
							res.sendStatus(500);
						} else {
							res.sendStatus(204);
						}
					});
				}
			});
		}
	});
};

exports.list = function(req, res) {
	// These are for history
	var content = {
		resourceType: "Bundle",
		id: "http://localhost:3000/medicationadministration",
		totalResults: 0,
		link: {
			href: "http://localhost:3000/medicationadministration",
			rel: "self"
		},
		updated: new Date(Date.now()),
		entry: []
	};
	
	MedicationAdministration.find(req.query, function (err, medicationadministrations) {
		if (err) {
			console.log(err);
			return next(err);
		}
		var counter = 0;
		async.forEach(medicationadministrations, function(aMedicationadministration, callback) {
			counter++;
			content.totalResults = counter;
			var entrywrapper = {
				fullUrl: "http://localhost:3000/" + aMedicationadministration.id,
				resource: aMedicationadministration
			};
			content.entry.push(entrywrapper);
			callback();
		}, function(err) {
			res.send(JSON.stringify(content));
		});
	});
};
