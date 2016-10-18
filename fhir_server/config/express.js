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

// create express object to be returned
var express  = require('express');
var provider = require('./mongoose.js');
var cons      = require('consolidate');
var bodyParser = require('body-parser')

// create app object and setup as exported member of module
var app = express();

//configure app
// assign the swig engine to .html files
app.engine('eco', cons.eco);

// set .html as the default extension 
app.set('view engine', 'eco');
app.set('views', __dirname + '/../app/views');

//var patientServiceInvoker = require(__dirname + '/../lib/patient_service_invoker');
//var observationServiceInvoker = require(__dirname + '/../lib/observation_service_invoker');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, charset=utf-8");
	next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// setup routes
// root url(not necessary)
app.get('/', function(req, res){
    provider.findAll(function(error,collection){
        //console.log('get all models', collection);
        res.render('index', { 
                title: 'Model Index',
                models: collection
        });
    })
});

//index for model(not necessary)
app.get('/:model', function(req,res){
	if(req.params.model === "favicon.ico"){
		return;
	}
	
	provider.findAll(function(error,collection){
		if(collection.indexOf(req.params.model.toLowerCase()) === -1){
			res.sendStatus(404);
		}
		else{
			var controller = require('../app/controllers/' + req.params.model.toLowerCase());
			controller.list(req,res);
		}
	})
});

app.get('/:model/:id/:vid', function(req,res){
	if(req.params.model === "favicon.ico"){
		return;
	}
	
	var controller = require('../app/controllers/' + req.params.model.toLowerCase());
	controller.load(req,res,req.params.id,req.params.vid, function(obj) {
		if(obj.constructor.name=="Error")
		{
			console.log("Got an error: " + obj)
			res.send(500)
		} else {
			controller.show(req,res)
		}
      
	});
});

app.get('/:model/:id', function(req,res){
	if (req.params.model === "favicon.ico") {
		return;
	}
	var controller = require('../app/controllers/' + req.params.model.toLowerCase());
	controller.load(req, res, req.params.id, function(obj) {
		if (!obj || obj.constructor.name === "Error") {
			console.log("Got an Error:" + obj);
			res.send(404);
		} else {
	        controller.show(req, res);
		}
	});
})

//create for model
app.post('/:model/create', function(req,res){
   var controller = require('../app/controllers/' + req.params.model.toLowerCase())
   controller.create(req,res)
});

app.put('/:model/update/:id', function(req,res){
	var controller = require('../app/controllers/'+req.params.model.toLowerCase());
	controller.load(req,res,req.params.id,function (obj) {
		if (obj.constructor.name == "Error") {
			console.log("Got an error:" + obj);
			res.send(500);
		} else {
			controller.update(req, res);
		}
	})

});

//destroy for model
//without vid
app.delete('/:model/destroy/:id', function(req,res){
	var controller = require('../app/controllers/' + req.params.model.toLowerCase());
		  controller.destroy(req,res);
});

exports.app = app;
