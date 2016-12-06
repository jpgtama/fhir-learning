/**
 * Created by 310199253 on 2016/11/29.
 */
var fs = require('fs');
var path = require('path');


var ichmBase = require('./ichmBase.js');

var formDefList = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'form_def.json'), 'UTF-8'));
var pciFormDef = formDefList;

// username and password
var passwd = {"loginId": "evan", "password": "Oct242016"};


addPCIFormResearch();
// addPCIData();



// function addPCIData() {
//
//     ichmBase.userLogin(passwd, function(){
//         // list research def
//         ichmBase.contentFormUrlEncoded();
//         ichmBase.request('/ichm/service/dynamicGrid/preload/researchDefGrid', 'POST', 'sort=-createTime&start=0&count=25', header =>{},
//             ret => {
//                 checkReturn('list research def', ret, ()=>{
//                     if(ret.items.length> 0){
//                         var researchDefId = ret.items[0].id;
//
//                         // get form def id
//                         ichmBase.contentJSON();
//                         ichmBase.request('/ichm/service/research/researchdef/'+researchDefId, 'GET', null, headers=>{}, ret=>{
//                             checkReturn('list form def id', ret, ()=>{
//                                 var formDefId = null;
//                                 ret.items.formDefs.forEach(f =>{
//                                     if(f.id!== 1){
//                                         formDefId = f.id;
//                                     }
//                                 });
//
//                                 if(formDefId){
//                                     _addFormData(0, researchDefId, formDefId);
//                                 }else{
//                                     console.error('no form def id found');
//                                 }
//                             });
//                         });
//                     }else{
//                         console.error('no form def');
//                     }
//                 });
//             });
//     });
// }

// function _addFormData(index, researchDefId, formDefId) {
//     console.log('add form data -->', index);
//     var rd = randomDataGenerator[index];
//
//     if(!rd){
//         console.error('no random data @'+index);
//         return;
//     }
//
//     var patientData = rd.patientData;
//     var pciData = rd.pciData;
//
//     // add patient
//     ichmBase.request('/ichm/service/registry/formdata/saveorupdate/true?researchDefId='+researchDefId+'&researchDataId=', 'POST',
//         {formDefId: 1, data: JSON.stringify(patientData)}, headers=>{},
//         ret=>{
//             checkReturn('add patient', ret, ()=>{
//                 var retObj = ret;
//                 var researchDataId = retObj.items.researchData.id;
//                 var patientId = retObj.items.researchData.patientId;
//
//                 // add form data
//                 ichmBase.request('/ichm/service/registry/formdata/saveorupdate/false?researchDefId='+researchDefId+'&researchDataId='+researchDataId, 'POST',
//                     {formDefId: formDefId, patientId: patientId, data: JSON.stringify(pciData)}, headers=>{},
//                     ret => {
//                         checkReturn('add pci form data', ret, ()=>{
//                             // add next
//                             index++;
//                             if(index < randomDataGenerator.length){
//                                 _addFormData(index, researchDefId, formDefId)
//                             }else{
//                                 ichmBase.logout();
//                             }
//                         });
//                     });
//             });
//         });
// }




function checkReturn(msg, ret, success) {
    msg = msg || 'return result';
    success = success || function(){};
    if(ret.code === 0) {
        console.log(msg, ret.code);
        success();
    }else{
        console.error(msg + 'failed');
    }
}

// add pci form def
function addPCIFormResearch(){
    ichmBase.userLogin(passwd, function(){
        // add pci form def
        ichmBase.request('/ichm/service/research/formdef', 'POST', {name: pciFormDef.name, predefined: false, sequences:JSON.stringify({"page":1,"section":1,"column":2,"text":1}), structrue: JSON.stringify(pciFormDef)}, header =>{},
            ret => {
                checkReturn('add pci form def', ret, () => {
                    var formDefId = ret.items.id;

                    if(formDefId){
                        // add research
                        ichmBase.request('/ichm/service/research/researchdef', 'POST', {"researchDef":{"startTime":"2016-11-29T16:00:00.000Z","name":pciFormDef.name},"formDefs":[{"id":"1"},{"id": formDefId}]}, headers =>{},
                            ret =>{
                                checkReturn('add research def', ret, () => {
                                });

                                ichmBase.logout();
                            });
                    }else{
                        console.error('no form def id returned');
                    }
                });
            });
    });
}



