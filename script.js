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
            if (calcStorage[a][2] == idSel) {
                let sel = calcStorage[a][0][calcStorage[a][0].length - 1];
                if (temp.firstValue == '') {
                    temp.firstValue = sel;
                }
                calcDisplay.textContent = sel;
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

const genCalcStorage = () => {
        memStorage.innerHTML = '';
        for (let a in calcStorage) {
        //generate html content of storage item 
        //header
        memStorage.innerHTML += `<div class='storage-item' id='${calcStorage[a][2]}'><div><h3><span class="editable" onkeypress="if (event.keyCode == 13) renameHeader(event)">${calcStorage[a][2]}</span></h3></div></div>`;

        //container items
        calcStorage[a][0].map((b,c) => {
            if (typeof(b) == 'number' && c !== calcStorage[a][0].length - 1) {
                document.getElementById(calcStorage[a][2]).innerHTML += `
                <div><span id="${c}" class="editable" onkeypress="if (event.keyCode == 13) {changeNum(event)}"><strong>${b}</strong></span>   
                <span id='${c}' class="editable" onkeypress="if (event.keyCode == 13) {rename(event)}">${calcStorage[a][1][c]}</span></div>`;
            } else {
                document.getElementById(calcStorage[a][2]).innerHTML += `<div>${b}</div>`;
            };
        });
    };
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
    genCalcStorage();
};

const rename = (a) => {
    a.target.setAttribute('contenteditable', false);
    const sel = a.target.parentNode.parentNode.childNodes[0].textContent;

    for (let b in calcStorage) {
        if (calcStorage[b][2] == sel) {
            calcStorage[b][1][a.target.id] = a.target.textContent
            console.log(calcStorage);
        };
    };
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
    const sel = a.target.parentNode.parentNode.parentNode.childNodes[0].textContent;
    const sel2 = a.target.parentNode;
    //calcStorage[sel][0][calcStorage[sel][0].length - 1] = '(recalc(calcStorage[sel][0]))';
    for (let a in calcStorage) {
        console.log(calcStorage[a][2])
        if (calcStorage[a][2] == sel) {
            calcStorage[a][0][sel2.id] = parseFloat(sel2.textContent);
            console.log('toto', recalc(calcStorage[a][0]))
            calcStorage[a][0][calcStorage[a][0].length - 1] = recalc(calcStorage[a][0]);
        }
    }
    genCalcStorage();
};








