/**
 * Created by 310199253 on 2016/12/30.
 */
var fs = require('fs');
var path = require('path');

var dataStr = fs.readFileSync(path.resolve(__dirname, 'real_data.json'), 'UTF-8');

var dataArray = JSON.parse(dataStr);


module.exports = {
    data: dataArray
};