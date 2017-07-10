/**
 * Created by 310199253 on 2017/2/7.
 */


var currentStr = '';
var pairs = new Pairs();

function parse(c) {
    c = c.trim();
    if (c === '=') {
        pairs.newPair();
        pairs.setKey(currentStr);
        currentStr = '';
    } else if (c === '"') {
        if (currentStr.length !== 0) {
            pairs.setValue(currentStr);
            currentStr = '';
        }
    }else{
        currentStr += c;
    }
}

function Pairs() {

    this.pairs = [];
    this.currentPair = null;
    this.currentKey = null;

    this.newPair = function () {
        if(this.currentPair){
            this.pairs.push(this.currentPair);
        }

        this.currentPair = {};
    };

    this.setKey = function (key) {
        this.currentPair.key = key;
    };

    this.setValue = function(value){
        this.currentPair.value = value;
    }

    this.end = function () {
        if(this.currentPair){
            this.pairs.push(this.currentPair);
        }
    }
}


var s = 'x="6" y="20" fill="rgba(130, 126, 120, 1.0)" font-family="Centrale, Tahoma, Arial" font-size="16px" font-weight="bold"';

for(var i=0;i<s.length;i++){
    parse(s.charAt(i));
}

pairs.end();

console.log(JSON.stringify(pairs.pairs));

// generate
function generate(){
    // domAttr.set(this.d2nTotalTime, '', '');
    pairs.pairs.forEach(p => {
        console.log("domAttr.set(this.d2nTotalTime, '"+p.key+"', '"+p.value+"');");
    })
}

generate();