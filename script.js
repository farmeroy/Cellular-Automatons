// alert('Webaudio Required');
// const audioctx = new AudioContext;

let limit = 10;

// const initialState = [ 1, 0, 0, 1, 0, 1, 0, 0, 1, 0 ];

const initialState = [
    Math.round(Math.random()),
    Math.round(Math.random()),
    Math.round(Math.random()),
    Math.round(Math.random()),
    Math.round(Math.random()),
    Math.round(Math.random()),
    Math.round(Math.random()),
    Math.round(Math.random()),
    Math.round(Math.random()),
    Math.round(Math.random())    
]

const pentatonic = [
    233.08,
    277.18,
    311.13,
    369.99,
    415.30,
    466.16,
    554.37,
    622.25,
    739.99,
    830.61
]

const rules = {
    '111': 0,
    '110': 0,
    '101': 0,
    '011': 1,
    '100': 1,
    '010': 1,
    '001': 1,
    '000': 0

};


let finalState = [
    initialState
];

function getCodedState(cellState) {
    const codedState = [];
    for ( let i = 0; i<cellState.length; i++) {
        let code = '';
        if (i === 0) {
            code += cellState.slice(i-1);
        } else {
            code += cellState.slice(i-1, i);
        }
        code += cellState[i];
        code += cellState[(i+1)%cellState.length];
      
        
        // console.log(code);
        codedState.push(code)
    }
    return codedState
}

// function playState(state) {
//     for (let i = 0; i<state.length; i++){
//         if (state[i] === 1) {
//             const note = new OscillatorNode(audioctx, {frequency: pentatonic[i]});
//             note.connect(audioctx.destination);
//             note.start();
//     }
// }
// }

function getNextState(cellState) {
    codedState = getCodedState(cellState);
    const nextState = [];
    for (code of codedState) {
        nextState.push(rules[code])
    }
    // console.log(nextState);
    // playState(nextState);
    return nextState;
}

// function iterateCell(initialState) {
//     limit --;
//     if (limit === 0) {
//         return;
//     }
//     iterateCell(getNextState(initialState))
// }

function createCellStructure(cellState) {
    let state = cellState;
    for (let i = 0; i<limit-1; i++){
        state = [...getNextState(state)];
        finalState.push(state);
    }
}
createCellStructure(initialState);

function setup() {
    createCanvas(400, 400);
}
  
function draw() {
    background(220);
    for (let i = 0; i< finalState.length; i++) {
        for (let j = 0; j<finalState[i].length; j++){
            fill( finalState[i][j] === 1 ? 255 : 0)
            square(j*40, i*40, 40)
        }
    }
}








// iterateCell(initialState);