/**
 * Created by 310199253 on 2016/11/30.
 */

var ichmBase = require('./ichmBase.js');

ichmBase.adminLogin(function(){


// add role
// /ichm/service/role
// {"role":{"name":"evan"},"permissionIds":[1,1001,1002,2,2001,2002,2003,2004,2005,2006,4,5,5011,5012,5013,5014,5021,5022,5023,6]}

    ichmBase.request('/ichm/service/role', 'POST', {"role":{"name":"evan"},"permissionIds":[1,1001,1002,2,2001,2002,2003,2004,2005,2006,4,5,5011,5012,5013,5014,5021,5022,5023,6]}, header =>{},
    body => {
        console.log('add role ok');

        ichmBase.request('/ichm/service/organization', 'POST', {"organization":{"name":"evan","parentId":"1"},"roleIds":[40970000]}, header =>{},
            body => {
                console.log('add organization ok');


                ichmBase.request('/ichm/service/practitioner', 'POST', {"organizationIds":[40978194],"practitioner":{"isEmpNoNull":true,"ideographicName":"evan","empNo":null},"user":{"loginName":"evan","password":"1234Abcd"},"isUser":true}, header =>{},
                    body => {
                        console.log('add practitioner ok');

                        ichmBase.userLogin({"loginId": "evan", "password": "1234Abcd"}, function(){

                            // valid
                            ichmBase.request('/ichm/service/security/password/valid', 'POST', {password: "1234Abcd", newPassword: "Oct242016"}, header =>{},
                                body => {
                                    console.log('valid ok');

                                    ichmBase.request('/ichm/service/security/password/change', 'POST', {"password":"1234Abcd","newPassword":"Oct242016"}, header =>{},
                                        body => {
                                            console.log('change password ok');
                                            ichmBase.logout();
                                        });
                                });



                        });



                });


         });

    });


// /ichm/service/permission/findPermissions
// {"code":0,"message":null,"items":[{"id":1,"display":"_permission_code_admin_","code":"admin","parent":null,"module":"admin","displayIndex":1000,"comment":null},{"id":1001,"display":"_permission_code_admin_manage_user_","code":"admin_manage_user","parent":"admin","module":"admin","displayIndex":1001,"comment":null},{"id":1002,"display":"_permission_code_admin_manage_careplan_","code":"admin_manage_careplan","parent":"admin","module":"admin","displayIndex":1002,"comment":null},{"id":2,"display":"_permission_code_scheduler_","code":"scheduler","parent":null,"module":"scheduler","displayIndex":2000,"comment":null},{"id":2001,"display":"_permission_code_scheduler_view_calendar_","code":"scheduler_view_calendar","parent":"scheduler","module":"scheduler","displayIndex":2001,"comment":null},{"id":2002,"display":"_permission_code_scheduler_manage_calendar_","code":"scheduler_manage_calendar","parent":"scheduler","module":"scheduler","displayIndex":2002,"comment":null},{"id":2003,"display":"_permission_code_scheduler_view_followup_","code":"scheduler_view_followup","parent":"scheduler","module":"scheduler","displayIndex":2003,"comment":null},{"id":2004,"display":"_permission_code_scheduler_manage_followup_","code":"scheduler_manage_followup","parent":"scheduler","module":"scheduler","displayIndex":2004,"comment":null},{"id":2005,"display":"_permission_code_scheduler_print_followup_app_","code":"scheduler_print_followup_app","parent":"scheduler","module":"scheduler","displayIndex":2005,"comment":null},{"id":2006,"display":"_permission_code_scheduler_print_followup_app_list_","code":"scheduler_print_followup_app_list","parent":"scheduler","module":"scheduler","displayIndex":2006,"comment":null},{"id":4,"display":"_permission_code_registry_","code":"registry","parent":null,"module":"registry","displayIndex":4000,"comment":null},{"id":5,"display":"_permission_code_research_","code":"research","parent":null,"module":"research","displayIndex":5000,"comment":null},{"id":5011,"display":"_permission_code_research_registry_view_","code":"research_registry_view","parent":"research","module":"research","displayIndex":5011,"comment":null},{"id":5012,"display":"_permission_code_research_registry_create_","code":"research_registry_create","parent":"research","module":"research","displayIndex":5012,"comment":null},{"id":5013,"display":"_permission_code_research_registry_update_","code":"research_registry_update","parent":"research","module":"research","displayIndex":5013,"comment":null},{"id":5014,"display":"_permission_code_research_registry_delete_","code":"research_registry_delete","parent":"research","module":"research","displayIndex":5014,"comment":null},{"id":5021,"display":"_permission_code_research_study_view_","code":"research_study_view","parent":"research","module":"research","displayIndex":5021,"comment":null},{"id":5022,"display":"_permission_code_research_study_create_","code":"research_study_create","parent":"research","module":"research","displayIndex":5022,"comment":null},{"id":5023,"display":"_permission_code_research_study_update_","code":"research_study_update","parent":"research","module":"research","displayIndex":5023,"comment":null},{"id":6,"display":"_permission_code_analysis_","code":"analysis","parent":null,"module":"analysis","displayIndex":6000,"comment":null}],"numRows":0,"total":0,"identifier":"id","label":"display"}


// add organization
// /ichm/service/organization
// {"organization":{"name":"evan","parentId":"1"},"roleIds":[40970000]}


// add practitioner
// /ichm/service/practitioner
// {"organizationIds":[40978194],"practitioner":{"isEmpNoNull":true,"ideographicName":"evan","empNo":null},"user":{"loginName":"evan","password":"1234Abcd"},"isUser":true}

    // change password
    // /ichm/service/security/password/change
    // {"password":"1234Abcd","newPassword":"Oct242016"}


});

