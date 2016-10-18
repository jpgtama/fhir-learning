var sentiment = require('sentiment');

var r1 = sentiment('Cats are stupid.');
console.dir(r1.score);        // Score: -2, Comparative: -0.666

var r2 = sentiment('Cats are totally amazing!');
console.dir(r2.score);        // Score: 4, Comparative: 1

//moderate
var r2 = sentiment('I just need to continue these medications...they have been so helpful.');
console.dir(r2.score);        // Score: 4, Comparative: 1

//ABSENT
var r2 = sentiment('I am having sexual problems.');
console.dir(r2.score);        // Score: 4, Comparative: 1

function max(list){
    if (list.length==0) return null;
    var max=list[0];
    for (var i=1;i<list.length;i++){
    max=Math.max(max,list[i]);
    }
    return max;
}
//MILD
exp = "I had a panic attack after working 100 hour weeks in my job and was admitted because they thought it was cardiac. I was cleared form that standpoint; Dr. Urbaniak diagnosed me with depression. I saw him for one visit and then saw Dr. Quattlebaum; that didn't work out; she was disorganized and double-booked.   I just want to feel better; the Effexor SR has helped and my anxiety is gone, but I still have no energy and I'm depressed.History of Present Illness and Precipitating Events"
fear = {"afraid":-5, "scared":-5, "frightened":-5, "nervous":-5, "jittery":-5, "shaky":-5}
exp = "I am having sexual problems."

sents = exp.split('.')
var scores = []
for (var i =0; i< sents.length; i++)
{
    console.log(i)
//var rlt = sentiment(sents[i], fear)
var rlt = sentiment(sents[i])
    scores.push(rlt.score)
    console.log(i, rlt.score)
    }
    console.log(scores)
    console.log(max(scores))

var r2 = sentiment(exp);
console.dir(r2.score);
