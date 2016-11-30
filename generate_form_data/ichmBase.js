/**
 * Created by 310199253 on 2016/11/30.
 */
var http = require('http');
var textEncoding = require('text-encoding');
var TextDecoder = textEncoding.TextDecoder;


function getCookie(cookieHeader) {
    // set-cookie: ["JSESSIONID=BB59304CB4131F4C7947117956B40516; Path=/ichm/; HttpOnly","GSESSIONID=\"\"; Expires=Tue, 29-Nov-2016 05:58:46 GMT; Path=/ichm; HttpOnly"]

    var cookie = '';
    cookieHeader.forEach(c =>{
        var item = c.split(';')[0];
        cookie+= item +'; ';
    });

    return cookie;
}

function setCookie(headers, options){
    // set cookies
    var cookie = getCookie(headers['set-cookie']);
    console.log(JSON.stringify(cookie));
    options.headers['Cookie'] = cookie;
}

function clearCookie(options) {
    options.headers['Cookie'] = '';
}

function request(path, method, bodyData, headerCallback, payloadCallback, errCallback){
    options.path = path || '/ichm/service/security/login';
    options.method = method || 'GET';

    startRequest(options, bodyData, headerCallback, payloadCallback, errCallback);
}

function startRequest(options, bodyData, headerCallback, payloadCallback, errCallback) {

    headerCallback = headerCallback || function (h) {
            // DO nothing
        };

    errCallback = errCallback || function (e) {
            console.log(e);
        };

    var req = http.request(options, function (res) {

        if (res.statusCode === 200) {
            headerCallback(res.headers);

            var resultString = '';

            res.on('data', function (data) {

                resultString += new TextDecoder('utf-8').decode(data);
            });

            res.on('end', () => {
                payloadCallback(JSON.parse(resultString));
            });

        } else {
            console.log("status code is not 200 -->", res.statusCode);
            console.log("status message is", res.statusMessage);
            errCallback(res.statusCode, res.statusMessage);
        }


        res.on('end', function () {
            //console.log('http request end');
        });
    });


    req.on('error', e => {
        errCallback(e);
    });

    if (bodyData) {
        if (typeof bodyData === 'object') {
            req.write(JSON.stringify(bodyData));
        } else {
            req.write(bodyData);
        }
    }
    req.end();
}

var options = {
    host: '127.0.0.1',
    port: 8080,
    path: '/ichm/service/security/login',
    method: 'POST',
    headers: {'Content-Type': 'application/json'}
};

var adminPasswd = {"loginId": "admin", "password": "123"};


function contentJSON(){
    options.headers['Content-Type'] = 'application/json';
}


function contentFormUrlEncoded() {
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
}

function adminLogin(next){

    next = next || function(){
            console.log('next after admin login');
        };

    options.path = '/ichm/service/security/login';
    options.method = 'POST';
    clearCookie(options);
    startRequest(options, adminPasswd, headers=>{
        setCookie(headers, options);
        next();
    }, body=>{

    });
}


function userLogin(passwd, next){
    next = next || function(){
            console.log('next after admin login');
        };

    options.path = '/ichm/service/security/login';
    options.method = 'POST';
    clearCookie(options);

    startRequest(options, passwd, headers=>{
        setCookie(headers, options);
        next();
    }, body=>{

    });
}

function logout() {
    //
    options.path = '/ichm/service/security/profile';
    options.method = 'DELETE';

    startRequest(options, null, headers=>{
        console.log('log out');
    }, body=>{

    });
}

module.exports = {
    options: options,

    contentFormUrlEncoded: contentFormUrlEncoded,

    contentJSON: contentJSON,

    adminLogin: adminLogin,

    userLogin: userLogin,

    logout: logout,

    request: request
};