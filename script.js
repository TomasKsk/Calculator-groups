const calculator = document.getElementById('calc-main');
const calcDisplay = document.querySelector('.calc-current');
const calcDispMem = document.querySelector('.calc-mem');
const saveIco = document.querySelector('.save-button');
const memStorage = document.querySelector('.calc-mem-storage');
const keys = document.getElementsByTagName("BODY")[0];
//let calcMem = {} //if group calcs
let calcStorage = {};
let calcStoreName = {}; 
let headerLastName = '';

let calcNum = '';
let calcNum2 = '';
let calcOp = '';
let calcObj = {};
let calcMem = [];
let numArr = ["0","1","2","3","4","5","6","7","8","9"]
let operandArr = ["÷", "x", "-", "+"]
let resolved = false;
let calcMemCount = 0;
let showCalcSwitch = false;

const genCalcStorage = () => {
    memStorage.innerHTML = '';
    for (let a in calcStorage) {
    //generate html content of storage item 
    //header
        memStorage.innerHTML += `<div class='storage-item' id='${a}'><div><h3><span onfocusout="renameHeader(event)" class="editable" onkeypress="if (event.keyCode == 13) renameHeader(event)">${calcStorage[a][2]}</span> <button class="delete-mem" onclick="deleteMem(event)">x</button></h3></div></div>`;

        //container items
        calcStorage[a][0].map((b,c) => {
            if (typeof(b) == 'number' && c !== calcStorage[a][0].length - 1) {
                document.getElementById(a).innerHTML += `
                <div><span id="${c}" onfocusout="changeNum(event)" class="editable" onkeypress="if (event.keyCode == 13) {changeNum(event)}"><strong>${b}</strong></span>
                <span id='${c}' onfocusout="rename(event)" class="editable" onkeypress="if (event.keyCode == 13) {rename(event)}">${calcStorage[a][1][c]}</span></div>`;
            } else {
                document.getElementById(a).innerHTML += `<div>${b}</div>`;
            };
        });
    };
}
// App storage
const saveData = () => {
    localStorage.setItem('Calc_save', JSON.stringify(calcStorage));
};

const loadData = () => {
    if (localStorage.getItem('Calc_save') !== null) {
        tempLocal = localStorage.getItem('Calc_save');
        calcStorage = JSON.parse(tempLocal);
        calcMemCount = Object.keys(calcStorage)[Object.keys(calcStorage).length - 1].match(/\d+/)[0];
        genCalcStorage();
    } else {
        localStorage.setItem('Calc_save', JSON.stringify({}));
    }
};

loadData();

const calcFunc = (e) => {
    let target = e.target.innerText;
    let numCheck = numArr.includes(target);
    let numLenCheck = calcNum.length < 15;
    let opCheck = operandArr.includes(target);
    let updateD = function(a){calcDisplay.innerText = a};
    let updateDmem = function(a){calcDispMem.innerText = a.join('')};
    
    // Handle consecutive operators
    if (opCheck && calcOp !== '' && calcNum === '') {
        // Replace the previous operator with the new one
        // replace changed operand
        calcMem[calcMem.length - 1] = target;
        calcOp = target;
        updateDmem(calcMem);
    } else {
        // adding numbers to calcnum - the current number in cache (until it is deleted by an operand or the length exceeds 15)
        if (numCheck && numLenCheck) {
            calcNum += target;
            // update the display
            updateD(calcNum);
        } else if (target === '.' && numLenCheck) {
            // Handle the decimal point
            if (!(/[.]/).test(calcNum)) {
                calcNum += target;
                updateD(calcNum);
            }
        } else if (opCheck) {
            // save the operand
            console.log('co sa deje', calcNum, calcOp);
            if (calcNum !== '') {
                if (calcOp !== '') {
                    calcNum2 = parseOp(calcNum2, calcOp, calcNum);
                    
                    calcOp = target;
                    updateDmem(calcMem);
                } else {
                    calcNum2 = calcNum;
                    calcOp = target;
                }
                calcMem.push(calcNum, calcOp)
                updateDmem(calcMem);
                calcNum = '';
                updateD(calcNum);
            }
            

            if (resolved) {
                calcMem = [calcNum2, calcOp];
                updateDmem(calcMem);
                resolved = false;
                saveIco.classList.add('hide');
            }
        } else if (target === '=') {
            // Handle the equals button for calculation
            if (calcNum2 !== '' && calcNum !== '' && calcOp !== '') {
                calcMem.push(calcNum);
                calcNum = parseOp(calcNum2, calcOp, calcNum);
                // calcMem = [];
                updateD(calcNum);
                updateDmem(calcMem);
                calcNum2 = '';
                calcNum = '';
                calcOp = '';
                resolved = true;
                // here should the save button appear
                saveIco.classList.remove('hide');
            }
        } else if (target === 'AC') {
            // reset all
            reset();
        };
    };
    console.log('calclmem', calcMem)
};

// functions for memory storage units, like renaming and editing of numbers
const memFunc = (a) => {
    console.log('target', a.target, 'parent', a.target.parentNode);
    console.log(calculator.dataset)
    //selecting and taking the calculated number from storage
    if (a.target.matches('.storage-item')) {
        //reset()
        let temp = calculator.dataset;
        let idSel = a.target.id
        for (let a in calcStorage) {
            if (a == idSel) {
                let sel = calcStorage[a][0][calcStorage[a][0].length - 1];
                if (temp.firstValue == '') {
                    temp.firstValue = sel;
                }
                calcDisplay.textContent = sel;
                calcNum = sel;
                temp.previousKeyType = 'number';
            };
        };
        console.log(calculator.dataset)

        //document.querySelector('.op6').textContent = 'AC'
    };

    //calc storage renaming
    if (a.target.matches('.editable')) {
        var parentSel = a.target.parentNode;

        if (parentSel.matches('H3')) {
            console.log('nasiel som nadpis');
            select(a);
            headerLastName = a.target.textContent;
        };

        if (parentSel.matches('div')) {
            console.log('nasiel som pomenovanie v kontajneri');
            select(a);
        };

    };

    if (a.target.matches('strong')) {
        console.log('nasiel som cislo kalkulacie');
        headerLastName = a.target.parentNode.parentNode.childNodes[0].textContent;
        select(a);
    };
};

const reset = () => {
    saveIco.classList.add('hide');
    [calcMem, calcOp, calcNum, calcNum2, calcDispMem.innerText, calcDisplay.innerText] = [[], '', '', '', '', ''];
}


const parseOp = (num1, op, num2) => {
    console.log(num1, num2)
    num1 = +(num1);
    num2 = +(num2);
    if (op === '+') return num1 + num2;
    if (op === '-') return num1 - num2;
    if (op === 'x') return num1 * num2;
    if (op === '÷') return num1 / num2;
};

const deleteMem = (e) => {
    // Get the text from the first child node of the parent element
    const selector = e.target.parentNode.firstChild.textContent;
        
    // Create a filtered object without the selected item
    const newObj = Object.fromEntries(
        Object.entries(calcStorage)
            .filter(([key, value]) => value[2] !== selector)
    );

    // Collect the keys and rename them according to their index
    const tempKeys = Object.keys(newObj).map((_, index) => `calc_${index + 1}`);

    // Update calcStorage with the filtered object
    calcStorage = newObj;

    // Update keys and memory references in the new object
    const updatedCalcStorage = {};
    let count = 1;

    for (const key in calcStorage) {
        updatedCalcStorage[`calc_${count}`] = calcStorage[key];
        if (/calc/.test(calcStorage[key][2])) {
            calcStorage[key][2] = tempKeys[count - 1];
        }
        count++;
    }

    calcStorage = updatedCalcStorage;
    calcMemCount = count - 1;
    saveData();
    genCalcStorage();
}

const saveCalc = () => {
    // convert text to numbers
    calcMem = calcMem.map(a => {
        return !operandArr.includes(a)
        ? +(a)
        : a;
    })
    calcMemCount++;
    //create the calc mem
    calcStorage[`calc_${calcMemCount}`] = [calcMem.concat('=', parseFloat(calcDisplay.textContent))]; // calcStorage{calc_num: [all calculations, sum]}
    //push zero names
    calcStorage[`calc_${calcMemCount}`].push(calcStorage[`calc_${calcMemCount}`][0].map(a => (typeof a == 'number') ? '...' : null)); // calcStorage{calc_num: [null, ...]}
    //generate header both keys and content of object so the name can change but not sorting
    calcStorage[`calc_${calcMemCount}`].push(`calc_${calcMemCount}`) // calcStorage{calc_num: calc_num}

    memStorage.textContent = '';
    console.log('calcstorage', calcStorage)
    genCalcStorage();
    reset();
    saveData();

};

const select = (arr) => {
    arr.target.setAttribute('contenteditable', true);
    document.execCommand('selectAll',false,null);
}

const renameHeader = (a) => {
    a.target.setAttribute('contenteditable', false);
    const sel = a.target.parentNode.parentNode.childNodes[0].textContent;
    console.log(a.target.textContent)

    for (let b in calcStorage) {
        if (calcStorage[b][2] == headerLastName) {
            calcStorage[b][2] = a.target.textContent;
            console.log(calcStorage);
        };
    };
    saveData();
    genCalcStorage();
};

const rename = (a) => {
    a.target.setAttribute('contenteditable', false);
    const sel = a.target.parentNode.parentNode.childNodes[0].textContent.split(' ')[0];
    const sel2 = a.target.parentNode.parentNode.id;
    console.log('toto je sel', sel2, a.target.id)

    /*
    for (let b in calcStorage) {
        if (calcStorage[b][2] == sel) {
            calcStorage[b][1][a.target.id] = a.target.textContent
            console.log(calcStorage);
        };
    };
    */

    for (let b in calcStorage) {
        console.log('toto teraz robim', b)
        if (b == sel2) {
            calcStorage[b][1][a.target.id] = a.target.textContent;
            console.log(calcStorage);
        }
    }
    saveData();
    genCalcStorage();
};

const recalc = (arr) => {
    let temp2 = [].concat(arr);
    console.log(temp2)
    let temp = parseOp(temp2[0], temp2[1], temp2[2]);
    console.log(temp)
    temp2.splice(0,3)

    while(temp2.length > 0 && temp2[0] !== '=') {
    let cur = temp2.splice(0,2);
    console.log(cur);
    temp = parseOp(temp, cur[0], cur[1]);
    }
    return temp;
}

const changeNum = (a) => {
    a.target.setAttribute('contenteditable', false);
    const sel = a.target.parentNode.parentNode.parentNode.id;
    const sel2 = a.target.parentNode;
    //calcStorage[sel][0][calcStorage[sel][0].length - 1] = '(recalc(calcStorage[sel][0]))';
    for (let a in calcStorage) {
        console.log(calcStorage[a][2])
        if (a == sel) {
            calcStorage[a][0][sel2.id] = parseFloat(sel2.textContent);
            console.log('toto', recalc(calcStorage[a][0]))
            calcStorage[a][0][calcStorage[a][0].length - 1] = recalc(calcStorage[a][0]);
        };
    };
    saveData();
    genCalcStorage();
};

const showCalcMem = () => {
    let selector = document.querySelector('.calc-mem-storage');
    selector.classList.toggle('visible');
    showCalcSwitch = showCalcSwitch ? false : true;
    menuIcon();
}

// load svg icons into html
let menuIcoHtml = document.getElementById('menu-icon-place');
let saveIcoHtml = document.getElementById('save-icon-place');

const menuIcon = () => {
    let temp = document.getElementById('calc-mem-storage')
    if (showCalcSwitch) {
        menuIcoHtml.innerHTML = 'x'
    } else {
        menuIcoHtml.innerHTML = '≡'
    }
}

menuIcon();


// SVG icons

saveIcoHtml.innerHTML = `
    <?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <!-- License: CC Attribution. Made by Taigaio: https://github.com/taigaio/taiga-design -->
    <svg 
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
    width="20"
    height="20"
    viewBox="0 0 400 400.00001"
    id="svg2"
    version="1.1"
    inkscape:version="0.91 r13725"
    sodipodi:docname="save.svg">
    <defs
        id="defs4" />
    <sodipodi:namedview
        id="base"
        pagecolor="#ffffff"
        bordercolor="#666666"
        borderopacity="1.0"
        inkscape:pageopacity="0.0"
        inkscape:pageshadow="2"
        inkscape:zoom="0.98994949"
        inkscape:cx="244.49048"
        inkscape:cy="180.68004"
        inkscape:document-units="px"
        inkscape:current-layer="layer1"
        showgrid="false"
        units="px"
        showguides="true"
        inkscape:guide-bbox="true"
        inkscape:window-width="1920"
        inkscape:window-height="1056"
        inkscape:window-x="1920"
        inkscape:window-y="24"
        inkscape:window-maximized="1">
        <sodipodi:guide
        position="200.71429,121.42857"
        orientation="1,0"
        id="guide23298" />
    </sodipodi:namedview>
    <metadata
        id="metadata7">
        <rdf:RDF>
        <cc:Work
            rdf:about="">
            <dc:format>image/svg+xml</dc:format>
            <dc:type
            rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
            <dc:title>

    </dc:title>
        </cc:Work>
        </rdf:RDF>
    </metadata>
    <g
        inkscape:label="Capa 1"
        inkscape:groupmode="layer"
        id="layer1"
        transform="translate(0,-652.36216)">
        <path
        style="opacity:1;fill:#000000;fill-opacity:1;stroke:none;stroke-width:25;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
        d="m 2.5e-5,652.36213 0,400.00007 399.999945,0 0,-311.40627 -88.5937,-88.5938 -286.406245,0 z m 90.98633,26.8985 218.025385,0 0,133.8652 -218.025385,0 z m 149.982415,19.7558 0,86 43,0 0,-86 z"
        id="save"
        inkscape:connector-curvature="0"
        sodipodi:nodetypes="ccccccccccccccccc">
        <title
            id="title23500">save</title>
        </path>
    </g>
    </svg>
`


