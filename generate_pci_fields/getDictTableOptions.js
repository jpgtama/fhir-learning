/**
 * Created by 310199253 on 2016/12/5.
 */

var fs = require('fs');
var path = require('path');
var endOfLine = require('os').EOL;

// read file line by line
var data = fs.readFileSync(path.resolve(__dirname, 'dict_table.tab'), 'UTF-8');
var lines = data.split(endOfLine);


var optionsMap = {};

for(var i=1;i<lines.length;i++){
    var line = lines[i];

    if(line.length === 0){
        continue;
    }

    var datas = line.split('\t');

    var dictItem = datas[0];

    if(!(dictItem in optionsMap)){
        optionsMap[dictItem] = [];
    }

    var option = {
        value: parseInt(datas[1]),
        label: datas[2].trim()
    };

    optionsMap[dictItem].push(option);

}

// console.log(JSON.stringify(optionsMap));

module.exports = {
    optionsMap: optionsMap
};