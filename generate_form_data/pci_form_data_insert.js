/**
 * Created by 310199253 on 2016/11/29.
 */
var fs = require('fs');
var path = require('path');


var ichmBase = require('./ichmBase.js');

var randomDataGenerator = require('./pci_form_data_random_generator.js');
var formDefList = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'form_def.json'), 'UTF-8'));
var pciFormDef = formDefList;

// username and password
var passwd = {"loginId": "evan", "password": "Oct242016"};


// addPCIFormResearch();
addPCIData();



function addPCIData() {

    ichmBase.userLogin(passwd, function(){
        // find out CathPCI research def
        ichmBase.contentFormUrlEncoded();
        ichmBase.request('/ichm/service/dynamicGrid/preload/researchDefGrid', 'POST', 'sort=-createTime&start=0&count=25', header =>{},
            ret => {
                checkReturn('list research def', ret, ()=>{
                    if(ret.items.length> 0){

                        var pciResearch = findOutResearchByName(ret.items, 'CathPCI');

                        if(pciResearch){
                            var researchDefId = pciResearch.id;

                            // get form def
                            ichmBase.contentJSON();
                            ichmBase.request('/ichm/service/research/researchdef/'+researchDefId, 'GET', null, headers=>{}, ret=>{
                                checkReturn('list form def id', ret, ()=>{
                                    // sort form def by id
                                    var formDefs = ret.items.formDefs.sort(function(a, b){ return a.id - b.id });
                                    var formDefsHolder = new FormDefsHolder(formDefs);

                                    // get random form data
                                    var formStructures = formDefs.map(fd => { return JSON.parse(fd.structrue)  });
                                    var randomDataList = randomDataGenerator.getRandomDataListForFormDefList(formStructures, 10);
                                    var randomDataListHolder = new RandomDataListHolder(randomDataList);

                                    // save form data
                                    addSingleFormData(randomDataListHolder, formDefsHolder, researchDefId, null, null);
                                });
                            });
                        }else{
                            console.error('no cath pci research def found');
                        }
                    }else{
                        console.error('no form def');
                    }
                });
            });
    });
}


function isPatientBasicInfoForm(formDef) {
    return formDef.id === 1;
}

function addSingleFormData(randomDataListHolder, formDefsHolder, researchDefId, researchDataId, patientId) {
    var formDef = formDefsHolder.getCurrentFormDef();
    if(formDef){
        var rd = randomDataListHolder.getCurrentRandomData();

        if(!rd){
            console.error('no random data @'+randomDataListHolder.index);
            return;
        }

        var formData = rd[formDefsHolder.index];

        if(!formData){
            console.error('no form data found for formdef index', formDefsHolder.index);
            return;
        }

        // parameters
        var isSync = 'false';
        var postData = {formDefId: formDef.id, patientId: patientId, data: JSON.stringify(formData)};

        if(isPatientBasicInfoForm(formDef)){
            isSync = 'true'; // sync patient basic info to patient golden data --> create new patient
            delete postData.patientId;
            researchDataId = '';
        }else{
            // do nothing currently
        }

        // add form data
        ichmBase.request('/ichm/service/registry/formdata/saveorupdate/'+isSync+'?researchDefId='+researchDefId+'&researchDataId='+researchDataId, 'POST',
            postData, headers=>{},
            ret => {
                checkReturn('add pci form data '+formDef.id, ret, ()=>{
                    if(isPatientBasicInfoForm(formDef)){
                        researchDataId = ret.items.researchData.id;
                        patientId = ret.items.researchData.patientId;
                    }

                    // add next form
                    formDefsHolder.increaseIndex();
                    addSingleFormData(randomDataListHolder, formDefsHolder,researchDefId, researchDataId, patientId);
                });
            });
    }else{
        // next random data
        if(randomDataListHolder.hasNext()){
            randomDataListHolder.increaseIndex();
            console.log('add random data @', randomDataListHolder.index);
            formDefsHolder.resetIndex();
            addSingleFormData(randomDataListHolder, formDefsHolder, researchDefId, researchDataId, patientId);
        }else{
            ichmBase.logout();
        }
    }
}


function checkReturn(msg, ret, success) {
    msg = msg || 'return result';
    success = success || function(){};
    if(ret.code === 0) {
        console.log(msg, ret.code);
        success();
    }else{
        console.error(msg + ' failed');
    }
}


function findOutResearchByName(researchDefList, name){
    var target = null;

    researchDefList.forEach(r => {
        if(r.name === name){
            target = r;
        }
    });

    return target;
}

function RandomDataListHolder(randomDataList){
    this.randomDataList = randomDataList;

    this.index = 0;

    this.increaseIndex = function () {
        this.index ++;
    };

    this.getCurrentRandomData = function () {
        return this.randomDataList[this.index];
    };

    this.hasNext = function () {
        return this.index +1< this.randomDataList.length;
    }
}


function FormDefsHolder(formDefs) {
    this.formDefs = formDefs;

    this.index = 0;

    this.increaseIndex = function () {
        this.index ++;
    };

    this.resetIndex = function () {
        this.index = 0;
    };

    this.getCurrentFormDef = function () {
        return this.formDefs[this.index];
    }
}





