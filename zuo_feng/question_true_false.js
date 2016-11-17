/**
 * Created by 310199253 on 2016/11/14.
 */

var rawInput = {
    "#and":
    {
        "title": "NCT02169765",
        "list":
            [
                {
                    "#and":
                    {
                        "title": "Age 18-75 years",
                        "list":
                            [
                                {
                                    "#and":
                                    {
                                        "title": "Age>=18",
                                        "list":
                                            [
                                                {
                                                    "#has_a":
                                                    {
                                                        "DiagnosticReport_codedDiagnosis": "rule ageGT18{\n when {\n p: Patient p.age >= 18\n }\n then {\n modify(p, function(){\n this.message = '>18';\n console.log('>18');\n p.isQualified = true;\n retract(camera)\n });\n }\n}",
                                                        "type": "Question"
                                                    }
                                                }
                                            ],

                                        "type": "Group"
                                    }
                                },

                                {
                                    "#and":
                                    {
                                        "title": "Age<=75",
                                        "list":
                                            [
                                                {
                                                    "#has_a":
                                                    {
                                                        "DiagnosticReport_codedDiagnosis": "rule ageGT18{\n when {\n p: Patient p.age <= 75\n }\n then {\n modify(p, function(){\n console.log('<75');\n retract(camera)\n });\n }\n}",
                                                        "type": "Question"
                                                    }
                                                }
                                            ],

                                        "type": "Group"
                                    }
                                }
                            ],

                        "type": "Group"
                    }
                }
            ],

        "type": "Group"
    }
};


function Sci_Interpreter(obj) {

    this.interpret = function(){
        // do something
        return true;
    }
}

function And_Interpreter(obj){

    if(obj.hasOwnProperty('#and')){

        var body = obj['#and'];

        this.interpreterList = [];

        if('list' in body){
            body.list.forEach(l => {

                if(l.hasOwnProperty('#and')){
                    this.interpreterList.push(new And_Interpreter(l));
                }else if(l.hasOwnProperty('#or')){
                    this.interpreterList.push(new Or_Interpreter(l));
                }else{
                    this.interpreterList.push(new Sci_Interpreter(l));
                }
            });
        }

        this.interpret = function(){
            var result = [];

            this.interpreterList.forEach(i => {
                result.push(i.interpret());
            });

            return { and:  result};
            // if(result.length == 1){
            //     return result[0];
            // }else {
            //     return { and:  result};
            // }
        }
    }else{
        throw 'wrong type';
    }
}


function Or_Interpreter(obj){

    if(obj.hasOwnProperty('#or')){
        var body = obj['#or'];

        this.interpreterList = [];

        if('list' in body){
            body.list.forEach(l => {
                if(l.hasOwnProperty('#and')){
                    this.interpreterList.push(new And_Interpreter(l));
                }else if(l.hasOwnProperty('#or')){
                    this.interpreterList.push(new Or_Interpreter(l));
                }else{
                    this.interpreterList.push(new Sci_Interpreter(l));
                }
            });
        }

        this.interpret = function(){
            var result = [];

            this.interpreterList.forEach(i => {
                result.push(i.interpret());
            });

            return { or:  result};
            // if(result.length == 1){
            //     return result[0];
            // }else {
            //     return { or:  result};
            // }
        }
    }else{
        throw 'wrong type'
    }
}

var rootInterpreter = new And_Interpreter(rawInput);

console.log(JSON.stringify(rootInterpreter.interpret()));
