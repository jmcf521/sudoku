// solver.js — plain functions, work with any board array passed in

// Checks if `num` already exists elsewhere in this row
function checkRow(board, row, num) {
    for (let c = 0; c < 9; c++) {
        const i = row * 9 + c;
        if (board[i] === num) {
            return false;
        }
    }
    return true;
}

// Checks if `num` already exists elsewhere in this column
function checkCol(board, col, num) {
    for (let r = 0; r < 9; r++) {
        const i = r * 9 + col;
        if (board[i] === num) {
            return false;
        }
    }
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
    const valid = checkRow(board, row, num) && checkCol(board, col, num) && checkBox(board, row, col, num);
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