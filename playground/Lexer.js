/**
 * Created by evan on 9/20/16.
 */
function Token(type, value, startPosition) {
    // symbol for Symbol '+-*/(),'
    // id for identifier,
    // string
    // number
    this.type = type;
    this.value = value;
    this.pos = startPosition;
}

function Lexer(str) {

    if (!str) {
        throw 'parameter is empty';
    }

    var input = new Input(str);

    var tokens = [];

    // parse
    var t = null;
    while (input.index < input.str.length) {
        if ((t = Symbol(input)) || (t = Identifier(input)) || (t = Num(input)) || (t = StringToken(input))) {
            tokens.push(t);
        } else if ((t = Space(input))) {
            // ignore space
        } else {
            throw 'Invalid character at ' + input.index + ': ' + input.current();
        }
    }

    return tokens;
}



function Input(str) {
    this.index = 0;
    this.str = str;
    this.current = function() {
        return this.str.charAt(this.index);
    }

    this.next = function(){
        return this.str.charAt(this.index +1);
    }
}

function Space(/* Input */input) {
    var c = input.str.charAt(input.index);
    if (c === ' ') {
        input.index++;
        return c;
    }
}

function Symbol(/* Input */input) {
    var c = input.str.charAt(input.index);
    if ('<>()[]{},":/.!-?|\'\r\n'.indexOf(c) !== -1) {
        var token = new Token('symbol', c, input.index);
        input.index++;
        return token;
    }

    // escape character: \r, \n
    //if('\\' === c){
    //    var nc = input.next();
    //
    //    if('rn'.indexOf(nc) !== -1){
    //        var token = new Token('symbol', c+nc, input.index);
    //        input.index+=2;
    //        return token;
    //    }
    //}
}

function Identifier(/* Input */input) {
    //
    var index = input.index;

    var state = 0;
    while (index < input.str.length) {
        var c = input.str.charAt(index);

        if (state === 0 && /[a-zA-Z]/.test(c)) {
            state = 1;
        } else if (state === 1 && /[a-zA-Z0-9_]/.test(c)) {
            state = 1;
        } else {
            break;
        }

        index++;
    }

    // check state
    if (state === 0) {
        return null;
    } else if (state !== 0 || index === input.str.length) {
        // success
        var t = input.str.substring(input.index, index);
        var token = new Token('id', t, input.index);
        input.index = index;
        return token;
    }
}

function Num(/* Input */input) {
    //
    var index = input.index;

    var state = 0;
    while (index < input.str.length) {
        var c = input.str.charAt(index);

        if (state === 0 && /[\-1-9]/.test(c)) {
            state = 1;
        } else if (state === 1 && /[0-9]/.test(c)) {
            state = 1;
        } else if (state === 1 && /[\.]/.test(c)) {
            state = 2;
        } else if (state === 2 && /[0-9]/.test(c)) {
            state = 2;
        } else {
            break;
        }

        index++;
    }

    // check state
    if (state === 1) {
        // no decimal
        var t = input.str.substring(input.index, index);
        t = parseInt(t);
        var token = new Token('number', t, input.index);
        input.index = index;
        return token;
    } else if (state === 2) {
        // has decimal
        var t = input.str.substring(input.index, index);
        t = parseFloat(t);
        var token = new Token('number', t, input.index);
        input.index = index;
        return token;
    }
}

function StringToken(/* Input */input) {
    //
    var index = input.index;

    var state = 0;
    while (index < input.str.length) {
        var c = input.str.charAt(index);

        if (state === 0 && /[']/.test(c)) {
            state = 1;
        } else if (state === 1 && /[^']/.test(c)) {
            state = 1;
        } else if (state === 1 && /'/.test(c)) {
            state = 3;
        } else if (state === 0 && /["]/.test(c)) {
            state = 2;
        } else if (state === 2 && /[^"]/.test(c)) {
            state = 2;
        } else if (state === 2 && /"/.test(c)) {
            state = 4;
        } else {
            break;
        }

        index++;
    }

    // check state
    if (state === 3 || state === 4) {
        // success
        var t = input.str.substring(input.index + 1, index - 1);
        var token = new Token('string', t, input.index);
        input.index = index;
        return token;
    } else if (state === 1) {
        throw 'no end \' for string';
    } else if (state === 2) {
        throw 'no end \" for string';
    }
}


// node js
exports.Lexer = Lexer;