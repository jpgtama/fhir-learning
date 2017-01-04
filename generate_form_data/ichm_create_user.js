/**
 * Created by 310199253 on 2016/11/30.
 */

var ichmBase = require('./ichmBase.js');

// change url
// ichmBase.options.host = '130.147.249.83';
ichmBase.options.host = '130.147.249.85';


// var user = {"loginId": "evan", "password": "Oct242016"};
// var user = {"loginId": "tester", "password": "Abc123456"};


// var userList = [
//     {"loginId": "evan", "password": "Oct242016"},
//     {"loginId": "tester", "password": "Abc123456"}
// ];

var userList = [
    {"loginId": "evan", "password": "Oct242016"}
];

function addUser(index) {

    var user = userList[index];

    if(!user){
        console.error('index not valid: ', index);
        return;
    }

    ichmBase.adminLogin(function(){
        ichmBase.request('/ichm/service/role', 'POST', {"role":{"name":user.loginId},"permissionIds":[1,1001,1002,2,2001,2002,2003,2004,2005,2006,4,5,5011,5012,5013,5014,5021,5022,5023,6]}, header =>{},
            body => {
                console.log('add role ok');

                ichmBase.request('/ichm/service/organization', 'POST', {"organization":{"name":user.loginId,"parentId":"1"},"roleIds":[40970000]}, header =>{},
                    body => {
                        console.log('add organization ok');


                        ichmBase.request('/ichm/service/practitioner', 'POST', {"organizationIds":[40978194],"practitioner":{"isEmpNoNull":true,"ideographicName":user.loginId,"empNo":null},"user":{"loginName":user.loginId,"password":"1234Abcd"},"isUser":true}, header =>{},
                            body => {
                                console.log('add practitioner ok');

                                // log out admin
                                ichmBase.logout();

                                ichmBase.userLogin({"loginId": user.loginId, "password": "1234Abcd"}, function(){

                                    // valid
                                    ichmBase.request('/ichm/service/security/password/valid', 'POST', {password: "1234Abcd", newPassword: user.password}, header =>{},
                                        body => {
                                            console.log('valid ok');

                                            ichmBase.request('/ichm/service/security/password/change', 'POST', {"password":"1234Abcd","newPassword":user.password}, header =>{},
                                                body => {
                                                    console.log('change password ok');
                                                    ichmBase.logout();


                                                    // add next user
                                                    addUser(index + 1);

                                                });
                                        });
                                });
                            });
                    });
            });

    });


}

addUser(0);

