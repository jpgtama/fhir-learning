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
var async = require('async');

var ResourceHistorySchema = new mongoose.Schema({
  resourceType: String,
  vistaId: String,
  resourceId: String,
  createdAt: Date,
  history: [{resourceId: String, createdAt: Date}],
  deleted: Boolean
},{collection: "ResourceHistory"});

ResourceHistorySchema.methods = {
  addVersion: function (resourceId, versionId) {
	this.resourceId = resourceId;
	this.vistaId = versionId;
	this.createdAt = new Date(Date.now());
  this.deleted = false;
  },

  getVersion: function (id, version, callback) {
    var resourceModel = mongoose.model(this.resourceType);
    resourceModel.findOne({id:id, 'meta.versionId':version}, function(err, instance){
		callback(err, instance);
    });
  },

  getVersionId: function (version) {
    var resourceId = this.history[version-1].resourceId;
    var hexString = resourceId.toHexString();
    return hexString;
  },

  versionCount: function () {
    return this.vistaId;
  },

  lastUpdatedAt: function () {
    return this.createdAt;
  },

  latestVersionId: function () {
    return _.last(this.history).resourceId.toHexString();
  },

  findLatest: function(callback) {
    var resourceModel = mongoose.model(this.resourceType);
	
	resourceModel.findOne({id: this.resourceId, 'meta.versionId': this.vistaId}, function(err, instance) {
      callback(err, instance);
    });
  }
  
};

ResourceHistorySchema.statics = {
  findInCacheOrLocal: function (resourceId, resourceType, cb) {
    var self = this;
    async.waterfall([
      function(callback) {
        self.findOne({vistaId: resourceId, "resourceType": resourceType}, function(err, resourceHistory) {
          callback(err, resourceHistory);
        });
      },
      function(resourceHistory, callback) {
        if (resourceHistory) {
          callback(resourceHistory);
        } else {
          self.findById(resourceId, function(err, resourceHistory) {
            callback(resourceHistory);
          });
        }
      }
    ], function(resourceHistory) {
      cb(resourceHistory);
    });
  }
};

mongoose.model('ResourceHistory', ResourceHistorySchema);