'use strict';

var _ = require('lodash');

var bbcms = require('./index');

// Make it transactional bundle
var makeTransactionalBundle = function (bundle, base, patientId) {
    _.each(bundle.entry, function (value) {
        value.request = {
            'method': (value.resource.resourceType === 'Patient') ? 'PUT' : 'POST',
            'url': (value.resource.resourceType === 'Patient') ? 'Patient/' + patientId : value.resource.resourceType
        };
        value.base = base;
    });
    bundle.type = 'transaction';
    return bundle;
};

var request = require('request');

// Get sample file from GitHub
//var istream = request.get('https://raw.githubusercontent.com/chb/sample_ccdas/master/Vitera/Vitera_CCDA_SMART_Sample.xml');
//var istream = request.get('http://admin:admin@localhost:8080/BaseX844/rest/iCMC/cda_test.xml');
//var istream = request.get('http://admin:admin@localhost:8080/BaseX844/rest/XMLs_10000/cda_test.xml');
var fs = require('fs');


//cda_xml_root_dir = 'C:\\projects\\PhilipsNLP.Apps\\digestX\\data\\test\\xml'
//C:\projects\PhilipsNLP.Apps\digestX\data\test\xml\20\1006710\8a96dc11-2094-11e6-bad1-000c295905c1.xml

//var PatientId = process.argv[2] //empi id for digest system
var PatientId = 'test2' //empi id for digest system
//var cda_xml_file_path = process.argv[3]
var cda_xml_file_path = 'digest_cda.xml'
//var cda_xml_file_path = 'digest_cda_condition_ok.xml'
var istream = fs.createReadStream(cda_xml_file_path)
istream
    .pipe(new bbcms.CcdaParserStream(PatientId /* PatientId */))
    .on('data', function (data) {
        var bundle = JSON.stringify(makeTransactionalBundle(data), null, '  ');

        console.log(bundle); // Result bundle

    })
    .on('error', function (error) {
        console.log(error);
    });