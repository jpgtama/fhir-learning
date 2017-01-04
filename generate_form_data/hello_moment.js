/**
 * Created by 310199253 on 2016/12/30.
 */
var moment = require('moment');

var m = moment("2013/7/18", "YYYY/MM/DD HH:mm:ss");
console.log(m.isValid());

console.log(m.valueOf());