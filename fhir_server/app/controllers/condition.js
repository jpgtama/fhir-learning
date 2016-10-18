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
var Condition = mongoose.model('Condition');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
	if(next){
			Condition.findOne({id: 'Condition/' + id, "meta.versionId": vid}, function(err, foundCondition) {
				if (!err) {
					if(!foundCondition) {
						res.sendStatus(404);
					} else {
						req.condition = foundCondition;
					    next(foundCondition);
					}
					
				} else {
					res.sendStatus(404);
				}	
			});
		} else {
			// Four arguments, so vid becomes next
			next = vid;
			ResourceHistory.findOne({resourceId: 'Condition/' + id}, function(rhErr, resourceHistory) {
				if (rhErr) {
					next(rhErr);
				}
				if(resourceHistory !== null) {
					req.resourceHistory = resourceHistory;
					req.resourceHistory.findLatest(function(err, condition) {
						req.condition = condition;
						next(condition);
					});
				}
				else{
					res.sendStatus(404);
				}	
			});
		}
};


exports.show = function(req, res) {
  var condition = req.condition;
  var json = JSON.stringify(condition);
  res.send(json);
};

exports.create = function(req, res) {
	var condition = new Condition(req.body);
	ResourceHistory.find({resourceType: 'Condition'}, function(rhErr, pat) {
		var count = pat.length + 1;
		condition.id = 'Condition/' + count;
		condition.meta = {
			versionId: 1,
			lastUpdated: new Date(Date.now())
		};
		condition.save(function(err, savedCondition) {
			if(err) {
				console.log(err);
				res.sendStatus(500);
			} else {
				var resourceHistory = new ResourceHistory({resourceType: 'Condition'});
				resourceHistory.addVersion(savedCondition.id, savedCondition.meta.versionId);
				resourceHistory.save(function(rhErr, savedResourceHistory){
					if (rhErr) {
					  res.sendStatus(500);
					} else {
					  var content = {"status":"created",
					                 "id":savedCondition.id};
					  res.send(JSON.stringify(content));
					}
				});
			}
		});
	});
};

exports.update = function(req, res) {
	var condition = _.extend(req.condition, req.body);
	var objectCondition = condition.toObject();
	delete objectCondition._id;
	objectCondition.id = 'Condition/' + req.params.id;
	objectCondition.meta = {
		versionId : parseInt(req.resourceHistory.vistaId) + 1,
		lastUpdated : new Date(Date.now())
	};
	var conditionModel = new Condition(objectCondition);
	conditionModel.save(function (err, savedCondition) {
		if (err) {
			res.sendStatus(500);
		} else {
			var resourceHistory = req.resourceHistory;
			resourceHistory.addVersion(savedCondition.id, savedCondition.meta.versionId);
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
	var conditionId = "Condition/" + req.params.id;
	Condition.find({id:conditionId}).remove(function (err) {
		if (err) {
			res.sendStatus(500);
		} else {
			ResourceHistory.findOne({resourceId: conditionId}, function(rhErr, resourceHistory) {
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
		id: "http://localhost:3000/condition",
		totalResults: 0,
		link: {
			href: "http://localhost:3000/condition",
			rel: "self"
		},
		updated: new Date(Date.now()),
		entry: []
	};
	
	Condition.find(req.query, function (err, conditions) {
		if (err) {
			console.log(err);
			return next(err);
		}
		var counter = 0;
		async.forEach(conditions, function(aCondition, callback) {
			counter++;
			content.totalResults = counter;
			var entrywrapper = {
				fullUrl: "http://localhost:3000/" + aCondition.id,
				resource: aCondition
			};
			content.entry.push(entrywrapper);
			callback();
		}, function(err) {
			res.send(JSON.stringify(content));
		});
	});
};
