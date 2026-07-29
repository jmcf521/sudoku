// solver.js — plain functions, work with any board array passed in

// Checks if `num` already exists elsewhere in this row
function checkRow(board, row, num) {
    for (let c = 0; c < 9; c++) {
        const i = row * 9 + c;
        //console.log("row " + row + " col " + c + " num " + board[i] + " input " + num);
        if (board[i] === num) {
            console.log("ROW INVALID");
            return false;
        }
    }
    console.log("ROW CLEAR");
    return true;
}

// Checks if `num` already exists elsewhere in this column
function checkCol(board, col, num) {
    for (let r = 0; r < 9; r++) {
        const i = r * 9 + col;
        //console.log("row " + r + " col " + col + " num " + board[i] + " input " + num);
        if (board[i] === num) {
            console.log("COL INVALID");
            return false;
        }
    }
    console.log("COL CLEAR");
    return true;
}

// Checks if `num` already exists elsewhere in this 3x3 box
function checkBox(board, row, col, num) {
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            const i = r * 9 + c;
            if (board[i] === num) {
                console.log("BOX INVALID");
                return false;
            }
        }
    }
    console.log("BOX CLEAR");
    return true;
}

// Combines all three checks
function isValid(board, index, num) {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const valid = checkRow(board, row, num) && checkCol(board, col, num) && checkBox(board, row, col, num);
    console.log("num " + num + " valid " + valid);
    return valid;
}

function findEmptyCell(board) {
    for (let i = 0; i < 81; i++) {
        if (board[i] === 0) return i;
    }
    return -1;
}

function solve(board) {
    const nextEmpty = findEmptyCell(board);

    if(nextEmpty === -1) return true;

    for (let num = 1; num <= 9; num++) {
        if(isValid(board, nextEmpty, num)) {
            board[nextEmpty] = num;

            if (solve(board) == true) return true;

            board[nextEmpty] == 0;
        }
    }
    return false;
}

// Temporary test puzzle (0 = blank) — a known valid, solvable sudoku
const testBoard = [
  1,0,3, 0,5,6, 0,8,9,
  4,5,0, 7,8,0, 1,2,0,
  0,8,9, 0,2,3, 0,5,6,

  2,0,1, 5,0,4, 8,0,7,
  5,6,0, 8,9,0, 2,3,0,
  0,9,7, 0,3,1, 0,6,4,

  3,0,2, 6,0,5, 9,0,8,
  6,4,0, 9,7,0, 3,1,0,
  0,7,8, 0,1,2, 0,4,5
];

const hardTestBoard = [
  1,0,0, 0,0,7, 0,9,0,
  0,3,0, 0,2,0, 0,0,8,
  0,0,9, 6,0,0, 5,0,0,

  0,0,5, 3,0,0, 9,0,0,
  0,1,0, 0,8,0, 0,0,2,
  6,0,0, 0,0,4, 0,0,0,

  3,0,0, 0,0,0, 0,1,0,
  0,4,0, 0,0,0, 0,0,7,
  0,0,7, 0,0,0, 3,0,0
];

// Run the solver and log the result
const result = solve(testBoard);
console.log("Solved successfully:", result);
console.log(testBoard);

// Prints a flat 81-element board as a readable 9x9 grid in the console
function printBoard(board) {
  for (let row = 0; row < 9; row++) {
    // Grab this row's 9 numbers and join them with spaces
    const rowValues = board.slice(row * 9, row * 9 + 9).join(" ");
    console.log(rowValues);
  }
}

printBoard(testBoard);
