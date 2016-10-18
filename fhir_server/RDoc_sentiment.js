function max(list){
    if (list.length==0) return null;
    var max=list[0];
    for (var i=1;i<list.length;i++){
    max=Math.max(max,list[i]);
    }
    return max;
}


sentiment = require('sentiment');

xml_file_name = process.argv[2]
//target_dir = 'C:\\projects\\PhilipsNLP.Apps\\Corpus\\data\\RDoc_2016\\track_2_training\\training\\'
target_dir = ''
var RDoc_xmlFile = target_dir + xml_file_name
var fs = require('fs');
    xmlReader = require('xmlreader');
xml_string = fs.readFileSync(RDoc_xmlFile).toString()
xmlReader.read(xml_string, function(errors, response){
 if(null !== errors ){
  console.log(errors)
  return;
 }
 var clinical_text = response.RDoC.TEXT.text()
 var sents = clinical_text.split('.')
 
 sents = clinical_text.split('.')
    var scores = []
    for (var i =0; i< sents.length; i++)
    {
        var rlt = sentiment(sents[i])
        scores.push(rlt.score)
        }
        console.log(max(scores))
    });




//var r1 = sentiment('Cats are stupid.');
//console.dir(r1);        // Score: -2, Comparative: -0.666

//var r2 = sentiment('Cats are totally amazing!');
//console.dir(r2);        // Score: 4, Comparative: 1