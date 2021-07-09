const startBtn = document.getElementById('start');
startBtn.addEventListener('click', startCells);
const options = document.getElementById('rule-number');

options.addEventListener('change', () => ruleNumber = options.value)

let limit = 10;

let finalState;

let initialState = [ ]
let ruleNumber = 0;



const rules = {
    '111': [0, 1],
    '110': [0, 0],
    '101': [0, 0],
    '011': [1, 1],
    '100': [1, 0],
    '010': [1, 1],
    '001': [1, 1],
    '000': [0, 0],

};


// let finalState = [
//     [...initialState]
// ];

function getCodedState(cellState) {
  const codedState = [];
  for (let i = 0; i < cellState.length; i++) {
    let code = "";
    if (i === 0) {
      code += cellState.slice(i - 1);
    } else {
      code += cellState.slice(i - 1, i);
    }
    code += cellState[i];
    code += cellState[(i + 1) % cellState.length];

    codedState.push(code);
  }
  return codedState;
}



function getNextState(cellState) {
    codedState = getCodedState(cellState);
    const nextState = [];
    for (code of codedState) {
        nextState.push(rules[code][ruleNumber])
    }

    return nextState;
}



function createCellStructure(cellState, cells) {
  let state = cellState;
  for (let i = 0; i < cells - 1; i++) {
    state = [...getNextState(state)];
    finalState.push(state);
  }
}

let sketch = function(p) {
  cells = document.getElementById('cell-number').value;
  let x = 0;
  let y = 0;
  p.setup = function () {
    p.createCanvas(400, 400);
  };

  p.draw = function () {
    p.background(220);
    for (let i = 0; i < finalState.length; i++) {
      for (let j = 0; j < finalState[i].length; j++) {
        p.fill(finalState[i][j] === 1 ? 255 : 0);
        p.square(j * (400/cells), i * (400/cells), (400/cells));
      }
    }
  }
}

function setInitialState(cellNumber) {
  const initialState = [];
  for (let i = 0; i < cellNumber; i++) {
    initialState.push(Math.round(Math.random()))
  }
  return initialState;
}


function startCells() {
  let cells = document.getElementById('cell-number').value;
  // limit = cells;
  initialState = setInitialState(cells)
  // [
  //   Math.round(Math.random()),
  //   Math.round(Math.random()),
  //   Math.round(Math.random()),
  //   Math.round(Math.random()),
  //   Math.round(Math.random()),
  //   Math.round(Math.random()),
  //   Math.round(Math.random()),
  //   Math.round(Math.random()),
  //   Math.round(Math.random()),
  //   Math.round(Math.random()),
  // ]
  ;

  finalState = [[...initialState]];
  if (document.querySelector("canvas")) {
    document.querySelector("canvas").remove();
  }
  createCellStructure(initialState, cells);
  let cellDraw = new p5(sketch);
}





