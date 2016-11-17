var fs = require('fs');


function generate15CompleDataTypes(){
    fs.readFile('./fhir-resources/data-types/15_complex.txt', 'utf-8', function(err, data){
        if(err){
            console.log(err);
        } else{
            //
            var obj = JSON.parse(data);


            // write files
            Object.keys(obj).forEach(function(name){
                console.log(name, obj[name]);

                fs.writeFile('./fhir-resources/data-types/'+name + '.txt', obj[name], function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log('ok  -> ', name);
                    }
                });


            });


        }
    });
}



// Patient
function handleFromResAndDomainRes(patientModelStr){

}


var lexer = require('./Lexer.js');

fs.readFile('fhir-resources/resources/Patient.txt','utf-8', function(err, data){
   if(err){
       console.log(err)
   } else{
       var tokens = lexer.Lexer(data);

       console.log(tokens);
   }
});