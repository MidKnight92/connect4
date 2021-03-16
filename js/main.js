/*----- constants -----*/
const COLORS = {
    '0': 'white',
    '1': 'lightskyblue',
    '-1': 'gray'
};

/*----- app's state (variables) -----*/
let board, turn, winner;

/*----- cached element references -----*/
const msg = document.getElementById('msg');
const markerEls = [...document.querySelectorAll('#markers > div')];
const restartButton = document.querySelector('button');

/*----- event listeners -----*/
document.getElementById('markers').addEventListener('click', handleClick);
restartButton.addEventListener('click', init);

/*----- functions -----*/
init();


function init() {

    // Initialize all state
    board = [
        [0,0,0,0,0,0], // Column 0
        [0,0,0,0,0,0], // Column 1
        [0,0,0,0,0,0], // Column 2
        [0,0,0,0,0,0], // Column 3
        [0,0,0,0,0,0], // Column 4
        [0,0,0,0,0,0], // Column 5
        [0,0,0,0,0,0], // Column 6
    ];
    turn = 1;
    winner = null;

    render();
}

function render() {

    // Render the board
    board.forEach(( columnArr, colIdx ) => {

        // Iterate over the col to access element
        columnArr.forEach( (rowEl, rowIdx) => {

            // Select the correct div for this rowVal
            const div = document.getElementById(`c${colIdx}r${rowIdx}`);

            // Set circle color
            div.style.backgroundColor = COLORS[rowEl];
        });

            // Hide or Show marker if column is full
            markerEls[colIdx].style.visibility = columnArr.includes(0) ? "visible" : "hidden";
    });

    // Render the message
    if (winner === 'T'){
        msg.innerText = `It's a tie`;
    } else if (winner){
        msg.innerHTML = `PLAYER <span style="color:${COLORS[winner]}; font-weight: bold"> ${winner === 1 ? winner : 2 }</span> WON`;
    } else {
        msg.innerHTML = `Player <span style="color:${COLORS[turn]}; font-weight: bold;"> ${turn === 1 ? turn : 2 }</span>'s turn`;
    }

}

function handleClick( e ) {

    // Update State & Call Render
    const colIdx = markerEls.indexOf(e.target);

    // User missed target or Winner stop click handler
    if (colIdx === -1 || winner) return;

    const colArr = board[colIdx];
    // Find the first open rowEl (0) on the colArr
    const rowIdx = colArr.indexOf(0);

    // User clicked on full column stop click handler 
    if (rowIdx === -1) return;

    // Update value on board
    colArr[rowIdx] = turn;

    // Change turn
    turn = turn === 1 ? -1 : 1;

    // Check for winner
    winner = getWinner();

    render();
}

function getWinner() {
    let winner = null;

    // Loop through the boards columns
    for (let col = 0; col < 7; col++ ){
        winner = checkColumnValues(col);
        if (winner) break;
    }
    return winner;
}

function checkColumnValues(colIdx) {
    const colArr = board[colIdx];

    // Check for winner
    for (let row = 0; row < colArr.length; row++) {
        let winner = checkUp(colArr, row) || checkRight(colIdx, row) || checkDiag(colIdx, row, 1);  
        if (winner) return winner;    
    }
    // Check for Tie
    return null;
}

function checkUp(colArr, rowIdx) {
    // Boundary Check 
    if (rowIdx > 2) return null;

    // Check for winner (value of four rows equals 4) 
    if ( Math.abs(colArr[rowIdx] + colArr[rowIdx + 1] + colArr[rowIdx + 2] + colArr[rowIdx + 3]) === 4){

        // Return Winner (1 || -1) based on element value
        return colArr[rowIdx];
    } else {

        // No winner
        return null;
    }
}

function checkRight(colIdx, rowIdx) {
    // Boundary Check
    if (colIdx > 3) return null;

    // Check for winner (value of four rows equals 4)
     if (Math.abs(board[colIdx][rowIdx] + board[colIdx + 1][rowIdx] + board[colIdx + 2][rowIdx] + board[colIdx + 3][rowIdx]) === 4) {
         return board[colIdx][rowIdx];
     } else{
         return null;
     }
}

function checkDiag(colIdx, rowIdx, direction) {
    if (direction == 1) {
        // Boundary Check (UP)
        if(colIdx > 3 || rowIdx > 2) return null;     
    } else {
        // Boundary Check (DOWN)
        if(colIdx > 3 || rowIdx < 3) return null;  
    }

     // Check for winner (value of four rows equals 4)
     if (Math.abs(board[colIdx][rowIdx] + board[colIdx + 1][rowIdx + direction] + board[colIdx + 2][rowIdx + (direction * 2)] + board[colIdx + 3][rowIdx + (direction * 3)]) === 4) {
        return board[colIdx][rowIdx];
    } else{
        // No winner Diagonally Up then check Diagonally Down
        if (direction === 1){
            console.log("checking down");
            checkDiag(colIdx, rowIdx, -1);
        } else {
            // No winner both up and down
            return null;
        }
    }

}