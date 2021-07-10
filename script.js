const startBtn = document.getElementById('start');
startBtn.addEventListener('click', startCells);
const options = document.getElementById('rule-number');
const cellRange = document.getElementById('cell-number');

const randomBtn = document.getElementById('random');
randomBtn.addEventListener('click', () => { rules = setRandomRule()});
options.addEventListener('change', () => { rules = ruleGenerator(options.value)});

let finalState; //saved as a global value so that the p5js instance can easily access it

let initialState = [ ]; // saved in the global for p5js to access



//default rules value
let rules = ruleGenerator(30);

//randomly generate a number
function randomNum(min, max) {
  return Math.floor(Math.random() * (max-min+1) + min);
} 

//generates a rules object from a decimal number by converting the decimal into a binary number
function ruleGenerator(num) {
  ruleBinary = (num*1).toString(2).split('');
  //make sure the rule is the right length by adding zeros in the beginning
  for (i = ruleBinary.length; i<8; i++) {
    ruleBinary.unshift('0')
  };
  //send the bits of the rule to the rules object
  return {
    '111': parseInt(ruleBinary[0]),
    '110': parseInt(ruleBinary[1]),
    '101': parseInt(ruleBinary[2]),
    '100': parseInt(ruleBinary[3]),
    '011': parseInt(ruleBinary[4]),
    '010': parseInt(ruleBinary[5]),
    '001': parseInt(ruleBinary[6]),
    '000': parseInt(ruleBinary[7]),
  }
}

// a funtion that ensures a new random number is generated for rules content
function setRandomRule() {
  const num = randomNum(0,255);
  options.value = num;
  return ruleGenerator(num)
}


//returns a random 0 or 1
function randomBi() {
  return Math.round(Math.random())
}



// this iterates over the local cell and returns a three digit code
function getCodedState(cellState) {
  const codedState = [];
  for (let i = 0; i < cellState.length; i++) {
    let code = "";
    if (i === 0) { // creates a circular iteration over the array
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
        nextState.push(rules[code])
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
  
  let x = 0;
  let y = 0;
  p.setup = function () {
    p.createCanvas(400, 400);
    p.noLoop();
    // const startBtn = document.getElementById('start');
    startBtn.addEventListener('click', ()=> {p.redraw()});
    cellRange.addEventListener('input', ()=> { p.redraw() });
    randomBtn.addEventListener('click', () => { p.redraw() });

    options.addEventListener('change', () => {p.redraw()})
    document.getElementById('state-type').addEventListener('change', () => {p.redraw()})

     
  }; 

  p.draw = function () {
  let cells = cellRange.value;
  initialState = setInitialState(cells);
  finalState = [[...initialState]]; // changes a global value so that the p5 instance can access it
  createCellStructure(initialState, cells);
    p.background(220);
    for (let i = 0; i < finalState.length; i++) {
      for (let j = 0; j < finalState[i].length; j++) {
        p.fill(finalState[i][j] === 0 ? 255 : 0);
        p.square(j * (400/cells), i * (400/cells), (400/cells));
      }
    }
  }
}

function setInitialState(cellNumber) {
  const initialSate = [];
  const stateType = document.getElementById('state-type').value;
  if (stateType === 'random') {
    initialState = randomInitialState(cellNumber)
  } else {
    initialState = fixedInitialState(cellNumber)
  }
  return initialState;
}

//creates an array of random binary cells based on the cellNumber argument
function randomInitialState(cellNumber) {
  const initialState = [];
  for (let i = 0; i < cellNumber; i++) {
    initialState.push(randomBi())
  }
  return initialState;
}

//generate a cellular state with a single black cell
function fixedInitialState(cellNumber) {
  const blackCell = Math.floor(cellNumber/2);
  const initialState = [];
  for (let i = 0; i < cellNumber; i++) {
    if (i === blackCell) {
      initialState.push(1)
    } else {
      initialState.push(0)
     }
  }
  return initialState;

}


function startCells() {
  if (!document.querySelector("canvas")) {
    let cellDraw = new p5(sketch);
  } 
}



