const startBtn = document.getElementById('start');
startBtn.addEventListener('click', startCells);
const options = document.getElementById('rule-number');

options.addEventListener('change', () => ruleNumber = options.value)


let finalState; //saved as a global value so that the p5js instance can easily access it

let initialState = [ ];
let ruleNumber = 0; // sets a default rule number


//an object containing all the rules for encoding cell groups
const rules = {
    '111': [0, 0, 1],
    '110': [0, 1, 0],
    '101': [0, 1, 0],
    '011': [1, 0, 1],
    '100': [1, 1, 0],
    '010': [1, 1, 1],
    '001': [1, 1, 1],
    '000': [0, 0, 0],

};

//returns a random 0 or 1
function randomBi() {
  return Math.round(Math.random())
}

// this iterates over the local cell and returns a three digit code
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


//this goes through the cell state, turns finds the codes for local cells, and returns the following state
function getNextState(cellState) {
    codedState = getCodedState(cellState);
    const nextState = [];
    for (code of codedState) {
        nextState.push(rules[code][ruleNumber])
    }

    return nextState;
}


//creates the entire structure, taking the initial state and the number of cells as arguments
function createCellStructure(cellState, cells) {
  let state = cellState;
  for (let i = 0; i < cells - 1; i++) {
    state = [...getNextState(state)];
    finalState.push(state); //this is saved as a global value so that the p5 instance can access it
  }
}

//sets up the p5 environment
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

//creates an array of random binary cells based on the cellNumber argument
function setInitialState(cellNumber) {
  const initialState = [];
  for (let i = 0; i < cellNumber; i++) {
    initialState.push(randomBi())
  }
  return initialState;
}


function startCells() {
  let cells = document.getElementById('cell-number').value;
  initialState = setInitialState(cells);
  finalState = [[...initialState]];
  if (document.querySelector("canvas")) {
    document.querySelector("canvas").remove();
  }
  createCellStructure(initialState, cells);
  let cellDraw = new p5(sketch);
}





