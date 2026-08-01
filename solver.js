// solver.js — plain functions, work with any board array passed in


// const puzzle = [
//     0,0,0, 9,0,0, 0,0,0,
//     9,0,0, 0,0,6, 2,4,0,
//     5,0,0, 0,4,3, 0,1,7,

//     0,6,5, 0,3,0, 0,0,0,
//     1,0,0, 5,0,9, 0,0,2,
//     0,0,0, 0,2,0, 1,6,0,

//     6,5,0, 3,8,0, 0,0,9,
//     0,9,8, 6,0,0, 0,0,3,
//     0,0,0, 0,0,5, 0,0,0
// ];


// Checks if `num` already exists elsewhere in this row
function checkRow(board, row, num, index) {
    for (let c = 0; c < 9; c++) {
        const i = row * 9 + c;
        if (board[i] === num && i != index) {
            //console.log("Row invalid. i " + i + " index " + index);
            return false;
        }
    }
    return true;
}

// Checks if `num` already exists elsewhere in this column
function checkCol(board, col, num, index) {
    for (let r = 0; r < 9; r++) {
        const i = r * 9 + col;
        if (board[i] === num && i != index) {
            //console.log("Col invalid. i " + i + " index " + index);
            return false;
        }
    }
    return true;
}

// Checks if `num` already exists elsewhere in this 3x3 box
function checkBox(board, row, col, num, index) {
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            const i = r * 9 + c;
            if (board[i] === num && i != index) {
                //console.log("Box invalid. i " + i + " index " + index);
                return false;
            }
        }
    }
    return true;
}

// Combines all three checks
function isValid(board, index, num) {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const valid = checkRow(board, row, num, index) && checkCol(board, col, num, index) && checkBox(board, row, col, num, index);
    //console.log("row " + row + " col " + col + " valid " + valid + " num " + num);
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
            board[nextEmpty] = 0;
        }
    }
    return false;
}

// console.log(puzzle);
// console.log(solve(puzzle));