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
var Encounter = mongoose.model('Encounter');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
	if(next){
			Encounter.findOne({id: 'Encounter/' + id, "meta.versionId": vid}, function(err, foundEncounter) {
				if (!err) {
					if(!foundEncounter) {
						res.sendStatus(404);
					} else {
						req.encounter = foundEncounter;
					    next(foundEncounter);
					}
					
				} else {
					res.sendStatus(404);
				}	
			});
		} else {
			// Four arguments, so vid becomes next
			next = vid;
			ResourceHistory.findOne({resourceId: 'Encounter/' + id}, function(rhErr, resourceHistory) {
				if (rhErr) {
					next(rhErr);
				}
				if(resourceHistory !== null) {
					req.resourceHistory = resourceHistory;
					req.resourceHistory.findLatest(function(err, encounter) {
						req.encounter = encounter;
						next(encounter);
					});
				}
				else{
					res.sendStatus(404);
				}	
			});
		}
};


exports.show = function(req, res) {
  var encounter = req.encounter;
  var json = JSON.stringify(encounter);
  res.send(json);
};

exports.create = function(req, res) {
	var encounter = new Encounter(req.body);
	ResourceHistory.find({resourceType: 'Encounter'}, function(rhErr, pat) {
		var count = pat.length + 1;
		encounter.id = 'Encounter/' + count;
		encounter.meta = {
			versionId: 1,
			lastUpdated: new Date(Date.now())
		};
		encounter.save(function(err, savedEncounter) {
			if(err) {
				console.log(err);
				res.sendStatus(500);
			} else {
				var resourceHistory = new ResourceHistory({resourceType: 'Encounter'});
				resourceHistory.addVersion(savedEncounter.id, savedEncounter.meta.versionId);
				resourceHistory.save(function(rhErr, savedResourceHistory){
					if (rhErr) {
					  res.sendStatus(500);
					} else {
					  var content = {"status":"created",
					                 "id":savedEncounter.id};
					  res.send(JSON.stringify(content));
					}
				});
			}
		});
	});
};

exports.update = function(req, res) {
	var encounter = _.extend(req.encounter, req.body);
	var objectEncounter = encounter.toObject();
	delete objectEncounter._id;
	objectEncounter.id = 'Encounter/' + req.params.id;
	objectEncounter.meta = {
		versionId : parseInt(req.resourceHistory.vistaId) + 1,
		lastUpdated : new Date(Date.now())
	};
	var encounterModel = new Encounter(objectEncounter);
	encounterModel.save(function (err, savedEncounter) {
		if (err) {
			res.sendStatus(500);
		} else {
			var resourceHistory = req.resourceHistory;
			resourceHistory.addVersion(savedEncounter.id, savedEncounter.meta.versionId);
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
	var encounterId = "Encounter/" + req.params.id;
	Encounter.find({id:encounterId}).remove(function (err) {
		if (err) {
			res.sendStatus(500);
		} else {
			ResourceHistory.findOne({resourceId: encounterId}, function(rhErr, resourceHistory) {
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
		id: "http://localhost:3000/encounter",
		totalResults: 0,
		link: {
			href: "http://localhost:3000/encounter",
			rel: "self"
		},
		updated: new Date(Date.now()),
		entry: []
	};
	
	Encounter.find(req.query, function (err, encounters) {
		if (err) {
			console.log(err);
			return next(err);
		}
		var counter = 0;
		async.forEach(encounters, function(aEncounter, callback) {
			counter++;
			content.totalResults = counter;
			var entrywrapper = {
				fullUrl: "http://localhost:3000/" + aEncounter.id,
				resource: aEncounter
			};
			content.entry.push(entrywrapper);
			callback();
		}, function(err) {
			res.send(JSON.stringify(content));
		});
	});
};
