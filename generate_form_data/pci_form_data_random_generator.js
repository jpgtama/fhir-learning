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

var realData = require('./real-data/generate_real_data');

// Use Chance here.
// var my_random_string = chance.string();



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


// function readFormDef(){
//     var data = fs.readFileSync(path.resolve(__dirname, 'form_def.json'), 'UTF-8');
//     console.log(data);
//
//
//     return JSON.parse(data);
// }

// var formDef = readFormDef();

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

// var patientFields = [];
// var pciFields = [];

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


// findOutFields(formDef[0], patientFields);
// findOutFields(formDef[1], pciFields);




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

/**
 *
 * return value structure:
 *
 * {
 * value: xxxx,
 * formattedValue: xxxx
 * }
 *
 * currently, only 'value' is returned. 'formattedValue' is preserved for back compatiable.
 *
 *
 * @type {{seq: {}, text: randomData.text, date: randomData.date, datetime: randomData.datetime, textarea: randomData.textarea, radio: randomData.radio, checkbox: randomData.checkbox, boolean: randomData.boolean, select: randomData.select, number: randomData.number, timediff: randomData.timediff}}
 */
var randomData = {

    seq: {},

    label: function(f){
        var label = f.label;
        var nextNum = this.seq[label] || 0;
        nextNum++;
        this.seq[label] = nextNum;

        var value = label + '_'+ nextNum;
        var ret = {value: value, formattedValue:value};
        return ret;
    },

    text: function (f) {
        var label = f.label;
        var nextNum = this.seq[label] || 0;
        nextNum++;
        this.seq[label] = nextNum;

        var value = label + '_'+ nextNum;
        var ret = {value: value, formattedValue:value};
        return ret;
    },

    date: function (f) {
        var label = f.label;
        if(label == '出生日期'){
            // return  moment(chance.birthday({year: chance.year({ min: 1970, max: 2000 }) })).format('YYYY-MM-DD');
            return randomDataFormat.date(moment(chance.birthday({year: chance.year({ min: 1970, max: 2000 }) })));
        }else{
            // return moment(chance.date({string: true, year: chance.year({ min: 2011, max: 2015 })})).format('YYYY-MM-DD');
            return randomDataFormat.date(moment(chance.date({year: chance.year({ min: 2011, max: 2015 })})));
        }
    },

    datetime: function (f) {
        var label = f.label;
        // return moment(chance.date({year: chance.year({ min: 2011, max: 2015 })})).format('YYYY-MM-DD HH:mm:ss');
        return randomDataFormat.datetime(moment(chance.date({year: chance.year({ min: 2011, max: 2015 })})));
    },

    textarea: function (f) {
        var label = f.label;

        var value = "无";
        var ret = {value: value, formattedValue:value};
        return ret;
    },

    radio: function (f) {
        var label = f.label;
        var options = f.options;
        // return options[chance.integer({min: 0, max: options.length-1})].label;
        return randomDataFormat.radio(chance.integer({min: 0, max: options.length-1}), options);
    },

    checkbox: function (f) {
        var label = f.label;
        var options = f.options;
        // return options[chance.integer({min: 0, max: options.length-1})].label;
        return randomDataFormat.radio(chance.integer({min: 0, max: options.length-1}), options);
    },

    boolean: function (f) {
        var label = f.label;
        var options = f.options;
        // return chance.bool();
        return randomDataFormat.boolean(chance.bool());
    },

    select: function (f) {
        var label = f.label;
        var options = f.options;
        // return options[chance.integer({min: 0, max: options.length-1})].label;
        return randomDataFormat.radio(chance.integer({min: 0, max: options.length-1}), options);
    },

    number: function(f){
        var label = f.label;
        var min = f.min;
        var max = f.max;
        var decimals = f.decimals;

        min = min || 0;
        max = max || 100;

        var value = null;
        if(decimals){
            value =  chance.floating({min: min, max: max, fixed: decimals});
        }else{
            value =  chance.integer({min: min, max: max});
        }

        var ret = {value: value, formattedValue:value};
        return ret;
    },

    timediff: function (f) {
        var label = f.label;
        var value = chance.integer({min: 0, max: 100});

        var ret = {value: value, formattedValue:value};
        return ret;
    }
};

// ['text', 'textarea', 'number', 'timediff'].forEach(name =>{
//     aop.after(randomData, name, function(value){
//         return {value: value, formattedValue:value};
//     });
// });

/**
 * get random data for common fields, not including nihss
 * @param f
 * @returns {*}
 */
function getCommonRandomData(f) {
    if(!f){
        return;
    }

    var rData;

    var ftype = f.type;
    if(randomData[ftype]){
        rData = randomData[ftype](f);
        // if(ftype === 'number'){
        //     // return randomDataGenerator[ftype](f.label, f.min, f.max, f.decimals);
        //     rData = randomData[ftype](f.label, f.min, f.max, f.decimals);
        // }else{
        //     // return randomDataGenerator[ftype](f.label, f.options);
        //     rData = randomData[ftype](f.label, f.options);
        // }
    }else{
        throw 'no random data function found for field: ' +  f.label +' , type is: '+ f.type;
    }

    // only return value currently
    if(ftype === 'checkbox'){
        return [rData.value];
    }else{
        return rData.value;
    }
}

function getRandomDataForNihss(rd, f) {
    var key = f.key;

    var elements = f.elements;

    if(elements){
        var sum = 0;
        var handleElement = function (rd, element) {
            var eKey = element.key;
            if(element.options && element.options.length > 0){
                var valueList = element.options.map(o => {
                    return o.value;
                });

                var index = Math.floor(Math.random() * valueList.length);

                var value = valueList[index];
                sum+= value;

                rd[eKey] = value;
            }else{
                console.error('no options found for element in nihss type field, set it to sum value');
                rd[eKey] = sum;
            }
        };

        elements.forEach(e => handleElement(rd, e));
        rd[key] = sum;
    }else{
        throw 'no elements found for nihss type field';
    }

}


function getRandomDataForMatrix(rd, f) {
    // matrix
    var cells = f.cells;

    if(cells && cells.length> 0){
        var  fieldsArray = [];

        var findOutAllFieldsInCellsArray = function (obj, fieldsArray) {
            if(Array.isArray(obj)){
                obj.forEach(o => {
                    findOutAllFieldsInCellsArray(o, fieldsArray)
                });
            }else{
                if(obj.type !== 'label'){
                    fieldsArray.push(obj);
                }else{
                    console.error('label field in matrix is not set data currently.');
                }
            }
        };

        findOutAllFieldsInCellsArray(cells, fieldsArray);

        fieldsArray.forEach(f => {
            // fieldsData[f.key] = getCommonRandomData(f);
            prepareRandomData(rd, f);
        });

    }else{
        throw 'no cells found for matrix field: '+ f.label;
    }
}


function prepareRandomData(rd, f){
    if(f.type === 'nihss'){
        getRandomDataForNihss(rd, f);
    }else if(f.type === 'matrix'){
        getRandomDataForMatrix(rd, f);
    }else{
        rd[f.key] = getCommonRandomData(f);
    }
}

function getRandomDataListForFormDefList(formDefList, dataSize) {

    var fieldsList = [];

    formDefList.forEach(formDef => {
        var fieldsArr = [];
        findOutFields(formDef, fieldsArr);

        // push to formDefList
        fieldsList.push(fieldsArr);
    });

    // randomDataList
    var randomDataList = [];

    // generate random data
    for(var i=0;i< (dataSize || 1);i++){

        var randomData = [];

        fieldsList.forEach(fields => {
            var fieldsData = {};
            fields.forEach(f => {
                // fieldsData[f.key] = getCommonRandomData(f);
                if(f){
                    prepareRandomData(fieldsData, f);
                }else{
                    debugger;
                    console.error('null field');
                }
            });

            randomData.push(fieldsData);
        });

        randomDataList.push(randomData);
    }

    return randomDataList;
}


function getRealDataListForFormDefList(formDefList) {

    var fieldsList = [];

    formDefList.forEach(formDef => {
        var fieldsArr = [];
        findOutFields(formDef, fieldsArr);

        // push to formDefList
        fieldsList.push(fieldsArr);
    });

    // randomDataList
    var randomDataList = [];

    // generate random data
    for(var i=0;i< (realData.data.length || 1);i++){

        var randomData = [];

        fieldsList.forEach(fields => {
            var fieldsData = {};
            fields.forEach(f => {
                fieldsData[f.key] = extractRealDataForField(f, realData.data[i])
            });

            randomData.push(fieldsData);
        });

        randomDataList.push(randomData);
    }

    return randomDataList;
}

function extractRealDataForField(f, data){
    // protect patient private information
    var ppif = ['患者姓名', '身份证号', '患者现住址', 'PCI手术术者姓名', 'PCI手术术者执照编号', '第一助手姓名', '外请专家姓名', '诊断性心导管术术者姓名', '诊断性心导管术术者执照编号'];

    if(ppif.indexOf(f.label) !== -1){
        return getCommonRandomData(f);
    }

    // check if there is real data for this field
    var label = f.label;

    var realData = data[label];
    if(realData){
        if(f.type ==='date' || f.type === 'datetime'){
            // data & datetime
            var m = moment(realData, "YYYY/MM/DD HH:mm:ss");
            return m.valueOf();
        }else if(f.type === 'boolean'){
            // boolean
            return realData === 'True';
        }else{
            // options
            if(!Number.isInteger(realData) && f.options && f.options.length> 0){
                return convertOptionLabelToValue(f, realData);
            }else{
                return realData;
            }
        }
    }else{
        // if not, use random data <-- don't need
        // return getCommonRandomData(f);
        return null;
    }
}

function convertOptionLabelToValue(f, label, isSecondTime) {
    // checkbox
    if(f.type === 'checkbox'){
        // multiple select
        var code = [];
        var lbs = label.split('|');

        if(lbs.length > 1){
            // debugger;
        }

        for(var i=0;i<lbs.length;i++){

            var cd = findSingleCodeInOptions(f.options, lbs[i].trim());
            if(!cd){
                console.error('no code value found for label: ', label, f.key);
            }else{
                code.push(cd);
            }
        }
        return code;
    }else{
        return findSingleCodeInOptions(f.options, label);
    }

    // f.options.forEach(op => {
    //    if(op.label === label){
    //        code = op.value;
    //    }
    // });
    //
    // if(!code){
    //     // try to remove space in label and try again
    //     if(!isSecondTime){
    //         label = label.replace(/ /g, '');
    //         return convertOptionLabelToValue(f, label, true);
    //     }
    //     console.error('no code value found for label: ', label);
    //     return label;
    // }else{
    //     return code;
    // }
}


function findSingleCodeInOptions(options, label, isSecondTime) {
    options.forEach(op => {
        if(op.label === label){
            code = op.value;
        }
    });

    if(!code){
        // try to remove space in label and try again
        if(!isSecondTime){
            label = label.replace(/ /g, '');
            return findSingleCodeInOptions(options, label, true);
        }
        // console.error('no code value found for label: ', label);
        // return label;
        return null;
    }else{
        return code;
    }
}

function getManyRandomDatasForMultiForms(obj, dataSize) {
    // obj: key: formdef
    // will retur an array, with element has the same key as the obj but with the random data as value
    var fieldsMap = JSON.parse(JSON.stringify(obj));

    // findOutFields(formDef[0], patientFields);
    Object.keys(fieldsMap).forEach(k => {
        var formDef = fieldsMap[k];
        var fieldsArr = [];
        findOutFields(formDef, fieldsArr);

        // replace old value
        fieldsMap[k] = fieldsArr;
    });

    // randomDataList
    var randomDataList = [];

    // generate random data
    for(var i=0;i<dataSize || 1;i++){

        var randomData = {};

        Object.keys(fieldsMap).forEach(k => {
            var fields = fieldsMap[k];

            var fieldsData = {};
            fields.forEach(f => {
                fieldsData[f.key] = getCommonRandomData(f);
            });

            randomData[k] = fieldsData;
        });

        randomDataList.push(randomData);
    }

    return randomDataList;
}


module.exports = {
    getManyRandomDatasForMultiForms: getManyRandomDatasForMultiForms,
    getRandomDataListForFormDefList: getRandomDataListForFormDefList,
    getRealDataListForFormDefList: getRealDataListForFormDefList
};