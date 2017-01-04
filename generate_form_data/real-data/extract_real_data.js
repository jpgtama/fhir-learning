/**
 * Created by 310199253 on 2016/12/30.
 */
var fs = require('fs');
var path = require('path');


var fileLines = [];

var patientNames = [];

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(path.resolve(__dirname, 'CDR_DATA_20161230-112923_clean.txt'), {encoding: 'UTF-8'})
});

lineReader.on('line', function (line) {
    console.log('Line from file:', line);
    fileLines.push(line);
});

lineReader.on('close', function(){
    console.log('line reader closed.');

    // header
    var hs = handleHeader(fileLines.shift());

    // body
    var dataObjList = handleBody(hs, fileLines);

    // write json to file
    fs.writeFileSync(path.resolve(__dirname, 'real_data.json'), JSON.stringify(dataObjList), {encoding: 'utf8'});
    console.log('write file end.');
});

function handleHeader(header) {
    // split by tab
    var hs = header.split('\t');

    // special handle headers
    for(var i=0;i<hs.length;i++){
        if(hs[i] === '姓名'){
            hs[i] = '患者姓名';
        }
    }

    console.log(hs.length);
    console.log(hs);

    return hs;
}


function handleBody(hs, body) {

    var dataObjList = [];

    for(var i=0;i<body.length;i++){
        var dataObj = handleOneLine(hs, body[i]);

        // remove duplicate name patient
        if(!isNameDuplicate(dataObj)){
            dataObjList.push(dataObj);
        }else{
            console.error('duplicate name patient:', dataObj['患者姓名']);
        }
    }

    return dataObjList;
}

function handleOneLine(hs, line) {
    var ds = line.split('\t');
    var obj = {};
    for(var i=0;i<hs.length;i++){
        obj[hs[i]] = ds[i];
    }

    return obj;
}

function isNameDuplicate(dataObj) {
    var name = dataObj['患者姓名'];

    if(name){
        if(patientNames.indexOf(name)!== -1){
            return true;
        }else{
            patientNames.push(name);
            return false;
        }
    }else{
        console.error('no patient name');
    }
}