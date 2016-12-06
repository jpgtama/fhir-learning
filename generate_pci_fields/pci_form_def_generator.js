/**
 * Created by 310199253 on 2016/12/2.
 */


var fs = require('fs');
var path = require('path');
var endOfLine = require('os').EOL;

// import dict tables
var optionsMap = require('./getDictTableOptions.js').optionsMap;


// read file line by line
var data = fs.readFileSync(path.resolve(__dirname, 'pci_data_dict.tab'), 'UTF-8');
var lines = data.split(endOfLine);

// lines.forEach(l => console.log('-> ',l));

// get headers
var headers = lines[0].split('\t');

// headers.forEach(h => console.log('-> ', h));


// construct data object
var jsonDataList = [];

var propList = ['FIELD_NAME', 'FIELD_LABEL', 'DICT_ITEM', 'DICT_TABLE', 'VISIBILITY_CONDITION', 'FIELD_COMPONENT_TYPE', 'FIELD_DATA_TYPE'];

for(var i=1;i<lines.length;i++){
    var line = lines[i];

    if(line.length === 0){
        continue;
    }

    var datas = line.split('\t');
    var dataObj = {};

    if(datas.length !== headers.length){
        console.error('data length !== headers length', JSON.stringify(datas));
    }else{
        for(var hi = 0;hi<headers.length;hi++){
            dataObj[headers[hi]] = datas[hi];
        }
        jsonDataList.push(dataObj);
    }
}

// console.log(JSON.stringify(jsonDataList));


var noTypeField = [];
var dataFieldComboList = [];


// Step 1: type
jsonDataList.forEach(d => {
    var type = checkType(d);

    if(type){
        dataFieldComboList.push({
            data: d,
            field: {
                type: type
            }
        });
    }else{
        console.error('no type found for', d['SECTION_LEVEL1'], d['BUSINESS_NAME']);
        noTypeField.push(d);
    }

});

var keyFieldMap = {};
var subFields = [];
// Step2: set attributes
dataFieldComboList.forEach(dfc => {
    setCommonAttributes(dfc);

    if(dfc.field.key in keyFieldMap){
        console.error('key already in keyFieldMap', dfc.field.key);
    }
    keyFieldMap[dfc.field.key] = dfc.field;

    setSpecificAttributes(dfc);

});

console.log('dfc size:', dataFieldComboList.length);
console.log('keyFieldMap size: ', Object.keys(keyFieldMap).length);

// Step 3: handle subs
dataFieldComboList.forEach(dfc => {
    handleSubs(dataFieldComboList, dfc);
});


// Step 4: remove sub fields
console.log('total fields size:', dataFieldComboList.length);
console.log('sub fields size:', subFields.length);

var rootLevelDfcList = [];
dataFieldComboList.forEach(dfc => {
   if(subFields.indexOf(dfc.field.key) === -1){
       rootLevelDfcList.push(dfc);
   }
});

console.log('root level fields size:', rootLevelDfcList.length);

// console.log(JSON.stringify(dataFieldComboList.map(dfc => {
//     return dfc.field.key;
// })));

// console.log(JSON.stringify(subFields));

// console.log(JSON.stringify(rootLevelDfcList));

// console.log(JSON.stringify(dataFieldComboList));


// Step 5: add section and page
var orderedPages = ['核心', '病史', '过程', 'PCI', '病灶', '出院'];
var pageSectionMap = {
    '核心': ['A.基本资料', 'B.保险支付', '计算字段'],
    '病史':['C.病史和风险因素'],
    '过程':['D.导管治疗记录', 'E.诊断性心导管术', 'F.冠状动脉造影评估'],
    'PCI':['G.PCI手术'],
    '病灶': ['H.病变和器械'],
    '出院': ['I.实验室检查', 'J.围术期', 'K.出院']
};

var form = new Form('CathPCI');
var pageNameMap = {};
rootLevelDfcList.forEach(dfc => {
    var pageName = findPageName(dfc);

    var page = form.getPage(pageName);

    var sectionName = findSectionName(dfc);

    var section = page.getSection(sectionName);

    section.addField(dfc.field);
});

console.log(JSON.stringify(form.toJson()));

function findPageName(dfc) {
    var sectionName = findSectionName(dfc);

    var targetName = null;

    Object.keys(pageSectionMap).forEach(pageName => {
        if(pageSectionMap[pageName].indexOf(sectionName) !== -1){
            targetName = pageName;
        }
    });

    return targetName;
}

function findSectionName(dfc) {
    var sectionName = dfc.data['SECTION_LEVEL1'];
    return sectionName;
}

function Form(name){
    this.name = name;
    this.pages = [];

    this.getPage = function (pageName) {

        var targetPage = findInArrayAndCreateIfNotExist(this.pages, function(p){
            return p.name === pageName;
        }, function(){
            return new Page(pageName);
        });

        return targetPage;
    };

    this.toJson = function () {

        // sort pages list
        var sortedPageList = [];
        orderedPages.forEach(p => {
            sortedPageList.push(this.getPage(p));
        });

        var ret = {
            name: this.name,
            pages: sortedPageList.map(p => { return p.toJson() })
        };

        return ret;
    }
}

function Page(name){
    this.name = name;
    this.sections = [];

    this.getSection = function (sectionName) {
        var targetPage = findInArrayAndCreateIfNotExist(this.sections, function(p){
            return p.name === sectionName;
        }, function(){
            return new Section(sectionName);
        });

        return targetPage;
    };

    this.toJson = function () {
        // sort section list
        var sortedSectionList = [];
        pageSectionMap[this.name].forEach(s => {
            sortedSectionList.push(this.getSection(s));
        });


        var ret = {
            name: this.name,
            sections: sortedSectionList.map(s => { return s.toJson() })
        };

        return ret;
    }
}

function Section(name){
    this.name = name;

    this.fields = [];

    this.addField = function (field) {
        this.fields.push(field);
    };

    this.toJson = function () {
        var ret = {
            name: this.name,
            columns: [{name: 'column1', fields: this.fields.map(p => { return p })}]
        };

        return ret;
    }
}


function findInArrayAndCreateIfNotExist(array, testFunc, createFunc){
    var target = null;
    array.forEach(t => {
        if(testFunc(t)){
            target = t;
        }
    });

    if(!target){
        target = createFunc();
        array.push(target);
    }

    return target;
}


function checkType(d){
    var typeMap = {
        'time	time': 'datetime',
        'textfield	text': 'text',
        'checkbox	boolean': 'boolean',
        'radio	list': 'radio',
        'mult_checkbox	list': 'checkbox',
        'date	date': 'date',
        'textfield	decimal': 'number',
        'textfield	integer':'number',
        'select	list': 'select',
        'mult_select	list':'select'
    };

    var key = d['FIELD_COMPONENT_TYPE']+'\t'+d['FIELD_DATA_TYPE'];

    var type = typeMap[key];

    return type;
}

function setCommonAttributes(dfc) {
    // key, label
    dfc.field.key = dfc.data['FIELD_NAME'].trim().toLowerCase();
    dfc.field.label = dfc.data['FIELD_LABEL'];
    dfc.field.groupby = '';
    dfc.field.hidelabel = false;
    dfc.field.desc = '';
    dfc.field.required = false;
    dfc.field.hidden = false;
    dfc.field.predefined = false;
    dfc.field.defaultvalue = null;
    dfc.field.permission = '';
}

function setSpecificAttributes(dfc) {

    var handlers = {
        date: function (dfc) {
            // date & datetime -> pattern
            if(dfc.field.type === 'date'){
                dfc.field.pattern = 'yyyy/MM/dd';
            }else if(dfc.field.type === 'datetime'){
                dfc.field.pattern = ["yyyy/MM/dd", "HH:mm"];
            }else{
                console.error('error type to handlers');
            }
        },


        datetime: function (dfc) {
            this.date(dfc);
        },

        text: function (dfc) {
            // text -> maxlength
            // nvarchar(100)
            var dt = dfc.data['DATA_TYPE'];
            var len = dt.match(/\d+/);
            if(len){
                dfc.field.maxlength = len[0];
            }else{
                console.error('no max length found for', dfc.data);
            }
        },

        number: function (dfc) {
            // number -> max, min, decimals
            var dt = dfc.data['DATA_TYPE'];
            if(dt == 'int'){
                // no value set
            }else if(dt.startsWith('decimal')){
                // currently we set this to decimals(6, 2)
                dfc.field.max = 9999;
                dfc.field.min = -999;
                dfc.field.decimals = 2;
            }else{
                console.error('not supported number type for ', dfc.data);
            }
        },

        hasOption: function (dfc) {
            var dictTable = dfc.data['DICT_TABLE'];
            var dictItem = dfc.data['DICT_ITEM'];

            if(dictTable === 'Dict_Candidate_Values'){
                    var options = getOptions(dictItem);
                    if(options){
                        dfc.field.options = JSON.parse(JSON.stringify(options));
                    }else{
                        console.error('no options found for ', dictItem, dfc.data);
                    }
            }else if(dictTable === 'Registry_Physician'){
                    dfc.field.options = [{value: 101, label: '王医生'}, {value: 102, label: '李医生'}];
            }else{
                console.error('not supported dict table', dictTable);
            }

        },

        select: function (dfc) {
            this.hasOption(dfc);
        },

        radio: function (dfc) {
            this.hasOption(dfc);
        },

        checkbox: function (dfc) {
            this.hasOption(dfc);
        },

        boolean: function (dfc) {
            // do nothing
        }
    };

    var handle = handlers[dfc.field.type];

    if(handle){
        handle.call(handlers, dfc);
    }else{
        console.error('no handler found for', dfc.field);
    }

}

function getOptions(dictItem) {
    if(dictItem == 'procedure_type'){
        return optionsMap['af_procedure_type'];
    }else{
        return optionsMap[dictItem];
    }
}

function handleSubs(dfcList, dfc) {
    var vc = dfc.data['VISIBILITY_CONDITION'];
    if(vc){
        if(vc.indexOf('==') !== -1){
            var arr = vc.split('==');
            var field = arr[0].trim().toLowerCase();
            var option = parseInt(arr[1]);

            var targetField = keyFieldMap[field];

            if(targetField){
                var options = targetField.options;
                options.forEach(p => {
                    if(p.value === option){
                        if(!('subs' in p)){
                            p.subs = [];
                        }

                        // add to subs
                        p.subs.push(dfc.field);

                        // remove sub field from map
                        console.log('sub field', dfc.field.label, dfc.field.key);
                        // delete keyFieldMap[dfc.field.key];
                        subFields.push(dfc.field.key);
                    }
                });
            }else{
                console.error('subs: target field not found for key', field);
            }

        }else{
            console.error('no "==" found in visibility condition');
        }
    }
}

