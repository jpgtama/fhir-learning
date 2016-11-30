/**
 * Created by 310199253 on 2016/11/29.
 */

var aop = require("node-aop");


var obj = {
    url:"",
    get : function(key){
        return this["key"];
    },
    set : function(key, value){
        this["key"] = value;
    }
};

var h1 = aop.before(obj, "set", function(key, value){
    value += " before-1 ";
    return [key, value]; // modify the parameters,
});

var h2 = aop.before(obj, "set", function(key, value){
    value += " before-2 ";// do not modify the parameters
    return [key, value];
});

obj.set("url", "http://mojijs.com");
console.log( obj.get("url") );  // http://mojijs.com before-1


var h3 = aop.after(obj, "get", function(value){
    value += " after-1 "; // do not modify the return value
});

var h4 = aop.after(obj, "get", function(value){
    value += " after-2 ";
    return value; // modify the return value
});


// after
console.log( obj.get("url") ); //http://mojijs.com before-1  after-2