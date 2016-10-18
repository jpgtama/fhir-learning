/**
 * Created by evan on 10/18/16.
 */

(function() {
    var updateButton = document.getElementById('updateDetails');
    var cancelButton = document.getElementById('cancel');
    var favDialog = document.getElementById('favDialog');

    // Update button opens a modal dialog
    updateButton.addEventListener('click', function() {
        favDialog.showModal();
    });

    // Form cancel button closes the dialog box
    cancelButton.addEventListener('click', function() {
        favDialog.close();
    });

})();


function showDialog(param, okF ,cancelF){
    var favDialog = document.getElementById('favDialog');

    // clear dialog content
    favDialog.innerHTML = '';


    // get section
    var section = toDom('<section></section>')();

    // get type dom
    param.forEach(function(p){
        var label = p.label;
        var value = p.value;

        var dom = typeDomMap[p.type](value);

        dom.addEventListener('keyup', function(e){
            p.value = this.value;
        });

        // var domStr = dom.outerHTML;

        var wrapper = toDom(`<p> <label>${label}</label>  </p>`)();

        //var str = `<p> <label>${label}</label>  ${domStr}   </p>`;

        wrapper.appendChild(dom);


        section.appendChild(wrapper);
    });


    var form = toDom('<form method="dialog"> </form>')();

    form.appendChild(section);

    form.appendChild(toDom(`<menu>
    <button class="cancel" type="reset">Cancel</button>
    <button class="submit" type="submit" value="confirm">Confirm</button>
    </menu>`)());


    favDialog.appendChild(form);

    // cancel
    var cancel = favDialog.querySelector('.cancel');
    cancel.addEventListener('click', function(e){
        if(cancelF)
            cancelF();
        favDialog.close();
    });

    // submit
    var submit = favDialog.querySelector('.submit');
    submit.addEventListener('click', function(e){
        if(okF)
            okF();
    });

    favDialog.showModal();
}





function allowDrop(ev) {
    /* The default handling is to not allow dropping elements. */
    /* Here we allow it by preventing the default behaviour. */
    ev.preventDefault();
}


function drag(ev) {
    /* Here is specified what should be dragged. */
    /* This data will be dropped at the place where the mouse button is released */
    /* Here, we want to drag the element itself, so we set it's ID. */
    ev.dataTransfer.setData("text/html", ev.target.innerHTML);
}

//        function drop(ev, section) {
//          /* The default handling is not to process a drop action and hand it to the next
//             higher html element in your DOM. */
//          /* Here, we prevent the default behaviour in order to process the event within
//             this handler and to stop further propagation of the event. */
//          ev.preventDefault();
//          /* In the drag event, we set the *variable* (it is not a variable name but a
//             format, please check the reference!) "text/html", now we read it out */
//          var data=ev.dataTransfer.getData("text/html");
//          /* As we put the ID of the source element into this variable, we can now use
//             this ID to manipulate the dragged element as we wish. */
//          /* Let's just move it through the DOM and append it here */
//          //ev.target.appendChild(document.getElementById(data));
//
//            console.log('drop -->', ev.target);
//
//            var q = generateQuestion(data);
//
//            section.appendChild(q);
//
//
//            section.parentElement.classList.remove('dragOver');
//        }


var types = ["boolean", "decimal", "integer", "date", "dateTime", "instant", "time", "string", "text", "url", "choice", "open-choice", "attachment", "reference", "quantity"];


var typeDomMap = {
    "boolean": toDom('<input type="checkbox"/>', function(dom, v){  if(v) dom.setAttribute('checked', v); }),
    "decimal": toDom('<input />', function(dom, v){ if(v)  dom.setAttribute('value', v); }),
    "integer": toDom('<input />', function(dom, v){ if(v)  dom.setAttribute('value', v); }),
    "date": toDom('<input />', function(dom, v){ if(v)  dom.setAttribute('value', v); }),
    "dateTime": toDom('<input />', function(dom, v){ if(v)  dom.setAttribute('value', v); }),
    "instant": toDom('<input />', function(dom, v){ if(v)  dom.setAttribute('value', v); }),
    "time": toDom('<input />', function(dom, v){ if(v)  dom.setAttribute('value', v); }),
    "string": toDom('<input />', function(dom, v){ if(v)  dom.setAttribute('value', v); }),
    "text": toDom('<textarea></textarea>', function(dom, v){ if(v)  dom.innerHTML = v; }),
    "url": toDom('<input />', function(dom, v){ if(v)  dom.setAttribute('value', v); }),
    "choice": toDom('<input />', function(dom, v){ if(v)  dom.setAttribute('value', v); }),
    "open-choice": toDom('<select> <option value="1">1</option>  <option value="2">2</option>  <option value="3">3</option> </select>', function(dom, v){  if(v)   v.forEach(function(i){ var op = document.createElement('option');  op.value = i; i.innerHTML = i; dom.appendChild(op);  });          }),
    "attachment": toDom('<input />', function(dom, v){ if(v)  dom.setAttribute('value', v); }),
    "reference": toDom('<input />', function(dom, v){ if(v)  dom.setAttribute('value', v); }),
    "quantity": toDom('<input />', function(dom, v){ if(v)  dom.setAttribute('value', v); })
};

function toDom(str, valueF){

    var d = document.createElement('div');
    d.innerHTML = str;



    return function(value){

        var dom = d.children[0].cloneNode(true);

        if(valueF){
            valueF(dom, value);
        }

        return dom;
    }

}


function addInfoAndClose(dom, infoF){

    dom.style.position = 'relative';


    var info = toDom('<span class="info">!</span>')();
    var close = toDom('<span class="close">X</span>')();

    dom.appendChild(info);
    dom.appendChild(close);

    // add event
    close.addEventListener('click', function(e){
        this.parentElement.remove();
    });

    info.addEventListener('click', function(e){
        var parent = this.parentElement;
        if(infoF){
            infoF(parent);
        }
    });




    function setPos(dom, top, right){
        dom.style.position = 'absolute';
        dom.style.top = top + 'px';
        dom.style.right = right + 'px';
    }

    setPos(info, 0, 20);
    setPos(close, 0, 5);


}

function addFields(){

    var fields = document.querySelector('.fields');

    types.forEach(function(t){
        var d = document.createElement('div');
        d.innerHTML = t;
        d.classList.add('f');
        d.setAttribute('draggable', 'true');
        d.setAttribute('ondragstart', 'drag(event)');

        fields.appendChild(d);
    });
}

addFields();


function addSection(){
    var pageBody = document.querySelector('.page .body');

    var d = document.createElement('div');
    d.classList.add('section');
    d.innerHTML = `<span class="info">!</span>
    <span class="close">X</span>
    <div class="name"><span>Section Name</span></div>

    <div class="body"  ondragover="allowDrop(event)"> </div>`;




    // drag enter
    // drag leave
    var sbody = d.querySelector('.body');

    function dragStyle(add){
        var dom = sbody;
        if(add){
            dom.classList.add('dragOver');
        }else{
            dom.classList.remove('dragOver');
        }
    }

    d.addEventListener('dragenter', function(e){
        e.stopPropagation();
        dragStyle(true);

        console.log('drag enter -->', e.target);
    });
    d.addEventListener('dragleave', function(e){
        e.stopPropagation();
        dragStyle(false);
        console.log('drag leave -->', e.target);
    });

    d.addEventListener('drop',function(ev){
        ev.preventDefault();

        var data=ev.dataTransfer.getData("text/html");


        console.log('drop -->', ev.target);

        var q = generateQuestion(data);

        sbody.appendChild(q);

        dragStyle(false);
    });




    // close event
    var close = d.querySelector('.close');
    close.addEventListener('click', function(e){
        this.parentElement.remove();
    });


    // info event
    var info = d.querySelector('.info');

    info.addEventListener('click', function(e){
        var nameDom = this.parentElement.querySelector('.name span');
        var param = [{type: 'string', label: 'Name:', value: nameDom.innerHTML}];
        var ok = function(){
            console.log('section property dialog submitted.');

            var newName = param[0].value;
            nameDom.innerHTML = newName;
            nameDom.setAttribute('title', newName);
        };
        var cancel = function(){
            console.log('section property dialog cancelled.')
        };

        showDialog(param, ok, cancel);
    });


    pageBody.appendChild(d);

}

addSection();


var typeNameIndexMap = {

};


function generateQuestion(type){

    if(!typeNameIndexMap[type]){
        typeNameIndexMap[type] = 1;
    }

    var name = type + ''+ typeNameIndexMap[type]++;

    var q = toDom(`<div class="question">  <div class="self"> <label> ${name}   </label> </div>    </div>`)();
    var qself = q.querySelector('.self');

    // drag enter
    // drag leave
    // drop
    qself.addEventListener('dragenter', function(e){
        e.stopPropagation();

        qself.classList.add('dragOver');
        console.log('drag enter -->', e.target);
    });

    qself.addEventListener('dragleave', function(e){
        e.stopPropagation();

        console.log('drag leave -->', e.target);
        qself.classList.remove('dragOver');

    });

    qself.addEventListener('drop', function(ev){
        // stop bubbling
        ev.stopPropagation();
        ev.preventDefault();

        console.log('drop -->', ev.target);

        // get data
        var data = ev.dataTransfer.getData('text/html');
        var childQ = generateQuestion(data);

        // add group
        var g = q.querySelector('.group') || toDom('<div class="group"></div>')();
        g.appendChild(childQ);


        q.appendChild(g);



        qself.classList.remove('dragOver');

    });

    // add dom
    var dom = typeDomMap[type]();

    qself.appendChild(dom);

    addInfoAndClose(qself, function(dom){
        var label = dom.querySelector('label');
        var param = {type: 'string', label: 'Question Name:', value: label.innerHTML.trim()};
        showDialog([param], function(){
            label.innerHTML = param.value;
        });

    });

    return q;
}

// add property function
function addPropertyFunction(obj, name) {

    if (typeof name === 'string') {

        var f = function (value) {
            if (value !== undefined) {
                obj['_' + name] = value;
                return obj;
            } else {
                return obj['_' + name];
            }
        };

        return f;
    } else {
        // no name
        return null;
    }
}

function toString(obj){
    var props = Object.keys(obj);
    for(var i in props){
        var name = props[i];
        if(name.startsWith('_')){
            console.log(name);
        }


    }
}

function Questionaire() {

    this.resourceType = "Questionnaire";

    //this.id = addPropertyFunction(this, 'id');
    this.status = addPropertyFunction(this, 'status');
    this.publisher = addPropertyFunction(this, 'publisher');

    this.rootGroup = addPropertyFunction(this, 'rootGroup');


}



function Group(){
    this.linkId = addPropertyFunction(this, 'linkId');
    this.title = addPropertyFunction(this, 'title');
    this.required = addPropertyFunction(this, 'required');

    this.group = [];

    this.addGroup = function(g){
        this.group.push(g);
    };

    this.question = [];

    this.addQuestion = function(q){
        this.question.push(q);
    };


}

function Question(){
    this.linkId = addPropertyFunction(this, 'linkId');
    this.text = addPropertyFunction(this, 'text');
    this.type = addPropertyFunction(this, 'type');
    this.required = addPropertyFunction(this, 'required');
    this.options = addPropertyFunction(this, 'options');

    this.option = [];

    this.addOption = function (o) {
        this.option.push(o);
    };

    this.group = [];

    this.addGroup = function(g){
        this.group.push(p);
    }

}
