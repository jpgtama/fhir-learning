/**
 * Created by 310199253 on 2016/11/14.
 */
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var aop = require("node-aop");

// Load Chance
var Chance = require('chance');

// Instantiate Chance so it can be used
var chance = new Chance();

// Use Chance here.
var my_random_string = chance.string();



// function readHeaders(){
//
//     var data = fs.readFileSync(path.resolve(__dirname, 'headers.tab'), 'UTF-8');
//     var headers = data.split('\t');
//     console.log(headers);
//
//     return headers;
// }
//
// var headers = readHeaders();


function readFormDef(){
    var data = fs.readFileSync(path.resolve(__dirname, 'form_def.json'), 'UTF-8');
    console.log(data);


    return JSON.parse(data);
}

var formDef = readFormDef();

// loop form def
function findOutFields(obj, resultArray){

    if(Array.isArray(obj)){
        obj.forEach(o => findOutFields(o, resultArray));
    }else if(typeof  obj == 'object'){
        if('fields' in obj){
            handleFields(obj.fields, resultArray);
        }else{
            Object.keys(obj).forEach(k => {
                findOutFields(obj[k], resultArray);
            })
        }
    }
}

var patientFields = [];
var pciFields = [];

// var fieldsMap = {};
// var headerKeyMap = {};

function handleFields(fields, resultArray){

    fields.forEach(f => {

        if(f.hasOwnProperty('options')){
            handleOptions(f.options, resultArray);
        }

        resultArray.push(f);
    });

}

function handleOptions(options, resultArray) {
    if(options.length > 0){
        options.forEach(op => {
            if(op.hasOwnProperty('subs') && op.subs && op.subs.length>0 ){
                handleFields(op.subs, resultArray);
            }
        });
    }
}


findOutFields(formDef[0], patientFields);
findOutFields(formDef[1], pciFields);




var randomDataFormat = {
    date: function (mo) {
        return {value: mo.valueOf(), formattedValue: mo.format('YYYY-MM-DD')};
    },

    datetime: function (mo) {
        return {value: mo.valueOf(), formattedValue: mo.format('YYYY-MM-DD HH:mm:ss')};
    },

    radio: function (index, options) {
        return {value: options[index].value, formattedValue: options[index].label};
    },

    boolean: function (tf) {
        return {value: tf, formattedValue: tf?'是':'否'};
    }
};


var randomData = {

    seq: {},

    text: function (label) {
        var nextNum = this.seq[label] || 0;
        nextNum++;
        this.seq[label] = nextNum;
        return label + '_'+ nextNum;
    },

    date: function (label) {
        if(label == '出生日期'){
            // return  moment(chance.birthday({year: chance.year({ min: 1970, max: 2000 }) })).format('YYYY-MM-DD');
            return randomDataFormat.date(moment(chance.birthday({year: chance.year({ min: 1970, max: 2000 }) })));
        }else{
            // return moment(chance.date({string: true, year: chance.year({ min: 2011, max: 2015 })})).format('YYYY-MM-DD');
            return randomDataFormat.date(moment(chance.date({year: chance.year({ min: 2011, max: 2015 })})));
        }
    },

    datetime: function (label) {
        // return moment(chance.date({year: chance.year({ min: 2011, max: 2015 })})).format('YYYY-MM-DD HH:mm:ss');
        return randomDataFormat.datetime(moment(chance.date({year: chance.year({ min: 2011, max: 2015 })})));
    },

    textarea: function (label) {
        return "无";
    },

    radio: function (label, options) {
        // return options[chance.integer({min: 0, max: options.length-1})].label;
        return randomDataFormat.radio(chance.integer({min: 0, max: options.length-1}), options);
    },

    checkbox: function (label, options) {
        // return options[chance.integer({min: 0, max: options.length-1})].label;
        return randomDataFormat.radio(chance.integer({min: 0, max: options.length-1}), options);
    },

    boolean: function (label, options) {
        // return chance.bool();
        return randomDataFormat.boolean(chance.bool());
    },

    select: function (label, options) {
        // return options[chance.integer({min: 0, max: options.length-1})].label;
        return randomDataFormat.radio(chance.integer({min: 0, max: options.length-1}), options);
    },

    number: function(label, min, max, decimals){
        min = min || 0;
        max = max || 100;
        if(decimals){
            return chance.floating({min: min, max: max, fixed: decimals});
        }else{
            return chance.integer({min: min, max: max});
        }
    },

    timediff: function (label) {
        return chance.integer({min: 0, max: 100});
    }

};

['text', 'textarea', 'number', 'timediff'].forEach(name =>{
    aop.after(randomData, name, function(value){
        return {value: value, formattedValue:value};
    });
});


function getRandomData(f) {
    if(!f){
        return;
    }

    var rData;

    var ftype = f.type;
    if(randomData[ftype]){
        if(ftype === 'number'){
            // return randomData[ftype](f.label, f.min, f.max, f.decimals);
            rData = randomData[ftype](f.label, f.min, f.max, f.decimals);
        }else{
            // return randomData[ftype](f.label, f.options);
            rData = randomData[ftype](f.label, f.options);
        }
    }else{
        console.error('no random data for ', f.label, f.type);
    }

    // return
    if(ftype === 'checkbox'){
        return [rData.value];
    }else{
        return rData.value;
    }


}


function getRandomDataAsKeyObject() {
    var randomDataList = [];

    // output data
    for(var i=0;i<10;i++){
        var patientData = {};
        var pciData = {};

        patientFields.forEach(f => {
            patientData[f.key] = getRandomData(f);
        });

        pciFields.forEach(f => {
            pciData[f.key] = getRandomData(f);
        });

        randomDataList.push({
            patientData: patientData,
            pciData: pciData
        });
    }

    return randomDataList;
}


var dataList = getRandomDataAsKeyObject();

console.log(JSON.stringify(dataList));

// split to patient and other
// var splitDataList = [];
// dataObjList.forEach(eachData => {
//     var patientDataObj = {};
//     var otherDataObj = {};
//
//     'patientName,birthDate,ethnic,mrn,socialSecurity,inpatientNo,allergies,gender,patientAge,maritalStatus,idCard,outpatientNo,empi,isDeceased,deceasedTime'.split(',').forEach(k =>{
//         patientDataObj[k] = eachData[k];
//     });
//
//     Object.keys(eachData).forEach(k => {
//         if(!patientDataObj.hasOwnProperty(k)){
//             otherDataObj[k] = eachData[k];
//         }
//     });
//
//     splitDataList.push({
//         patientDataObj: patientDataObj,
//         otherDataObj: otherDataObj
//     });
// });




// Object.keys(patientDataObj).forEach(k => console.log(k, patientDataObj[k]));
// console.log('==============================================');
// Object.keys(otherDataObj).forEach(k => console.log(k, otherDataObj[k]));


module.exports = dataList;