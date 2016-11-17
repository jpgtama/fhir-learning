/**
 * Created by 310199253 on 2016/11/14.
 */
var fs = require('fs');
var path = require('path');
var moment = require('moment');

// Load Chance
var Chance = require('chance');

// Instantiate Chance so it can be used
var chance = new Chance();

// Use Chance here.
var my_random_string = chance.string();



function readHeaders(){

    var data = fs.readFileSync(path.resolve(__dirname, 'headers.tab'), 'UTF-8');
    var headers = data.split('\t');
    console.log(headers);

    return headers;
}

var headers = readHeaders();


function readFormDef(){
    var data = fs.readFileSync(path.resolve(__dirname, 'form_def.json'), 'UTF-8');
    console.log(data);


    return JSON.parse(data);
}

var formDef = readFormDef();

// loop form def
function findOutFields(obj){

    if(Array.isArray(obj)){
        obj.forEach(o => findOutFields(o));
    }else if(typeof  obj == 'object'){
        if('fields' in obj){
            handleFields(obj.fields);
        }else{
            Object.keys(obj).forEach(k => {
                findOutFields(obj[k]);
            })
        }
    }
}

var fieldsMap = {};

function handleFields(fields){

    fields.forEach(f => {

        if(f.hasOwnProperty('options')){
            handleOptions(f.options);
        }

        if(fieldsMap[f.label]){
            console.error('duplicate field', f.label);
        }else{
            fieldsMap[f.label] = f;
        }


    });

}

function handleOptions(options) {
    if(options.length > 0){
        options.forEach(op => {
            if(op.hasOwnProperty('subs') && op.subs && op.subs.length>0 ){
                handleFields(op.subs);
            }
        });
    }
}


findOutFields(formDef);


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
            return  moment(chance.birthday({year: chance.year({ min: 1970, max: 2000 }) })).format('YYYY-MM-DD');
        }else{
            return moment(chance.date({string: true, year: chance.year({ min: 2011, max: 2015 })})).format('YYYY-MM-DD');
        }
    },

    datetime: function (label) {
        return moment(chance.date({year: chance.year({ min: 2011, max: 2015 })})).format('YYYY-MM-DD HH:mm:ss');
    },

    textarea: function (label) {
        return "无";
    },

    radio: function (label, options) {
        return options[chance.integer({min: 0, max: options.length-1})].label;
    },

    checkbox: function (label, options) {
        return options[chance.integer({min: 0, max: options.length-1})].label;
    },

    boolean: function (label, options) {
        return chance.bool();
    },

    select: function (label, options) {
        return options[chance.integer({min: 0, max: options.length-1})].label;
    },

    number: function(label){
        return chance.floating({min: 0, max: 100, fixed: 2});
    },

    timediff: function (label) {
        return chance.integer({min: 0, max: 100});
    }

};

function getRandomData(f) {
    if(!f){
        console.error("undefined field");
        return;
    }

    if(randomData[f.type]){
        return randomData[f.type](f.label, f.options);
    }else{
        console.error('no random data for ', f.label, f.type);
    }
}

var fileConent = '';
var endOfLine = require('os').EOL;
var delimeter = '\t';

// output header
fileConent += headers.join(delimeter) + endOfLine;
console.log(fileConent);

// output data
for(var i=0;i<1000;i++){
    var dataRow = [];
    headers.forEach(h => {

        if(!fieldsMap[h]){
            console.error("undefined field", h);
        }else{
            dataRow.push(getRandomData(fieldsMap[h]));
        }

    });

    console.log(i, dataRow.join(delimeter));
    fileConent += dataRow.join(delimeter) + endOfLine;
}

var dataFileName = 'data_pci.txt'
fs.writeFileSync(path.resolve(__dirname, dataFileName), fileConent, {encoding: 'utf8'});

console.log('write to', dataFileName);