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
var List = mongoose.model('List');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
	if(next){
			List.findOne({id: 'List/' + id, "meta.versionId": vid}, function(err, foundList) {
				if (!err) {
					if(!foundList) {
						res.sendStatus(404);
					} else {
						req.list = foundList;
					    next(foundList);
					}
					
				} else {
					res.sendStatus(404);
				}	
			});
		} else {
			// Four arguments, so vid becomes next
			next = vid;
			ResourceHistory.findOne({resourceId: 'List/' + id}, function(rhErr, resourceHistory) {
				if (rhErr) {
					next(rhErr);
				}
				if(resourceHistory !== null) {
					req.resourceHistory = resourceHistory;
					req.resourceHistory.findLatest(function(err, list) {
						req.list = list;
						next(list);
					});
				}
				else{
					res.sendStatus(404);
				}	
			});
		}
};


exports.show = function(req, res) {
  var list = req.list;
  var json = JSON.stringify(list);
  res.send(json);
};

exports.create = function(req, res) {
	var list = new List(req.body);
	ResourceHistory.find({resourceType: 'List'}, function(rhErr, pat) {
		var count = pat.length + 1;
		list.id = 'List/' + count;
		list.meta = {
			versionId: 1,
			lastUpdated: new Date(Date.now())
		};
		list.save(function(err, savedList) {
			if(err) {
				console.log(err);
				res.sendStatus(500);
			} else {
				var resourceHistory = new ResourceHistory({resourceType: 'List'});
				resourceHistory.addVersion(savedList.id, savedList.meta.versionId);
				resourceHistory.save(function(rhErr, savedResourceHistory){
					if (rhErr) {
					  res.sendStatus(500);
					} else {
					  var content = {"status":"created",
					                 "id":savedList.id};
					  res.send(JSON.stringify(content));
					}
				});
			}
		});
	});
};

exports.update = function(req, res) {
	var list = _.extend(req.list, req.body);
	var objectList = list.toObject();
	delete objectList._id;
	objectList.id = 'List/' + req.params.id;
	objectList.meta = {
		versionId : parseInt(req.resourceHistory.vistaId) + 1,
		lastUpdated : new Date(Date.now())
	};
	var listModel = new List(objectList);
	listModel.save(function (err, savedList) {
		if (err) {
			res.sendStatus(500);
		} else {
			var resourceHistory = req.resourceHistory;
			resourceHistory.addVersion(savedList.id, savedList.meta.versionId);
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
	var listId = "List/" + req.params.id;
	List.find({id:listId}).remove(function (err) {
		if (err) {
			res.sendStatus(500);
		} else {
			ResourceHistory.findOne({resourceId: listId}, function(rhErr, resourceHistory) {
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
		id: "http://localhost:3000/list",
		totalResults: 0,
		link: {
			href: "http://localhost:3000/list",
			rel: "self"
		},
		updated: new Date(Date.now()),
		entry: []
	};
	
	List.find(req.query, function (err, lists) {
		if (err) {
			console.log(err);
			return next(err);
		}
		var counter = 0;
		async.forEach(lists, function(aList, callback) {
			counter++;
			content.totalResults = counter;
			var entrywrapper = {
				fullUrl: "http://localhost:3000/" + aList.id,
				resource: aList
			};
			content.entry.push(entrywrapper);
			callback();
		}, function(err) {
			res.send(JSON.stringify(content));
		});
	});
};
