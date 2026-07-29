// Very simple test puzzle
const easypuzzle = [
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

//AI Escargot 
const hardpuzzle = [
    1,0,0, 0,0,7, 0,9,0,
    0,3,0, 0,2,0, 0,0,8,
    0,0,9, 6,0,0, 5,0,0,

    0,0,5, 3,0,0, 9,0,0,
    0,1,0, 0,8,0, 0,0,2,
    6,0,0, 0,0,4, 0,0,0,

    3,0,0, 0,0,0, 0,1,0,
    0,4,0, 0,0,0, 0,0,7,
    0,0,7, 0,0,0, 3,0,0
]

//Human solvable hard puzzle
const puzzle = [
    5,3,0, 0,7,0, 0,0,0,
    6,0,0, 1,9,5, 0,0,0,
    0,9,8, 0,0,0, 0,6,0,

    8,0,0, 0,6,0, 0,0,3,
    4,0,0, 8,0,3, 0,0,1,
    7,0,0, 0,2,0, 0,0,6,

    0,6,0, 0,0,0, 2,8,0,
    0,0,0, 4,1,9, 0,0,5,
    0,0,0, 0,8,0, 0,7,9
];

//Copy of current board so original does not need to be modified
const currentBoard = [...puzzle];

// Grab a reference to the empty board div from index.html
const board = document.getElementById("board");
let selectedCell = null;

// Build 81 cells (9x9) and add them to the board in order, left to right, top to bottom
for (let i = 0; i < 81; i++) {
    // Create a new empty div for this cell
    const cell = document.createElement("div");

    // Give it the "cell" class so style.css can style it
    cell.classList.add("cell");

    // Store this cell's position (0-80) on the element itself, for later use in game logic
    cell.dataset.index = i;

    // Check this cell's position in the puzzle array
    if (puzzle[i] !== 0) {
        // Not blank -- show the number inside this div
        cell.textContent = puzzle[i];
        cell.classList.add("given")

        cell.addEventListener("click", () => {
            if (selectedCell) {
                selectedCell.classList.remove("selected");
                selectedCell.classList.remove("selected-given");
                removeHighlight();
            }

            selectedCell = cell;
            cell.classList.add("selected-given");

            const selectedIndex = parseInt(selectedCell.dataset.index);
            const selectedRow = Math.floor( selectedIndex/ 9);
            const selectedCol = selectedIndex % 9;
            const givenNum = parseInt(selectedCell.textContent);

            highlightGiven(givenNum);
            highlightNum(givenNum);
            highlightInputs();

        });
    } if (puzzle[i] == 0) {
        cell.textContent = ""

        cell.addEventListener("click", () => {
            // Remove highlight from whichever cell was previously selected
            if (selectedCell) {
                selectedCell.classList.remove("selected");
                selectedCell.classList.remove("selected-given");
                removeHighlight();
            }

            // Mark this cell as the new selection
            selectedCell = cell;
            cell.classList.add("selected");

            // Highlight boxes in same row as selected
            const selectedIndex = parseInt(selectedCell.dataset.index);
            const selectedRow = Math.floor( selectedIndex/ 9);
            const selectedCol = selectedIndex % 9;
            const givenNum = parseInt(selectedCell.textContent);

            highlightRow(selectedRow);
            highlightCol(selectedCol);
            highlightNum(givenNum);
            highlightInputs();
            //highlightBox(selectedRow, selectedCol);
        });
    }

    // Add the finished cell into the board container
    board.appendChild(cell);
}

document.addEventListener("keydown", (event) => {
    // Do nothing if no cell is selected, or if the selected cell is a fixed clue
    if (!selectedCell || selectedCell.classList.contains("given")) return;

    // event.key is the actual character pressed, as a string -- e.g. "5"
    if (event.key >= "1" && event.key <= "9") {
        const index = parseInt(selectedCell.dataset.index);
        const num = parseInt(event.key);


        if (isValid(puzzle, index, num)) {
            console.log("valid");
            currentBoard[index] = num;
            selectedCell.textContent = num;
            selectedCell.classList.remove("invalid");
            highlightNum(num);
            highlightGiven(num);
        } else {
            console.log("invalid");
            currentBoard[index] = num;
            selectedCell.textContent = num;
            selectedCell.classList.add("invalid");
        }
    }

    // Let Backspace/Delete clear the cell
    if (event.key === "Backspace" || event.key === "Delete") {
        const index = parseInt(selectedCell.dataset.index);
        currentBoard[index] = 0;
        selectedCell.textContent = "";
        selectedCell.classList.remove("invalid");
    }
});

function highlightRow(selectedRow) {
    for (let c = 0; c < 9; c++) {
        const i = selectedRow * 9 + c;
        if (!board.children[i].classList.contains("selected")) board.children[i].classList.add("highlighted");
        if (board.children[i].classList.contains("given")) board.children[i].classList.add("highlighted-given");
        console.log(board.children[i])
    }
}

function highlightCol(selectedCol) {
    for (let r = 0; r < 9; r++) {
        const i = r * 9 + selectedCol;
        if (!board.children[i].classList.contains("selected")) board.children[i].classList.add("highlighted");
        if (board.children[i].classList.contains("given")) board.children[i].classList.add("highlighted-given");
        console.log(board.children[i])
    }
}

function highlightBox(selectedRow, selectedCol) {
    const boxRow = Math.floor(selectedRow / 3) * 3;
    const boxCol = Math.floor(selectedCol / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            const i = r * 9 + c;
            if (!board.children[i].classList.contains("selected")) board.children[i].classList.add("highlighted");
            if (board.children[i].classList.contains("given")) board.children[i].classList.add("highlighted-given");
        }
    }
}

function highlightNum(num) {
    for (let i = 0; i < 81; i++) {
        if (parseInt(board.children[i].textContent) == num) {
            board.children[i].classList.add("highlighted-num");
        }
    }
}

function highlightInputs() {
    for (let i = 0; i < 81; i++) {
        if (board.children[i].textContent != "" && !board.children[i].classList.contains("given")) {
            board.children[i].classList.add("highlighted");
        }
    }
}

function highlightGiven(num) {
    for (let i = 0; i < 81; i++) {
        if (parseInt(board.children[i].textContent) == num) {
            const col = i % 9;
            const row = Math.floor(i / 9);
            highlightCol(col);
            highlightRow(row);
            highlightBox(row, col);
        }
    }
}

function removeHighlight() {
    for (let i = 0; i < 81; i++) {
        board.children[i].classList.remove("highlighted");
        board.children[i].classList.remove("highlighted-given");
        board.children[i].classList.remove("highlighted-num");
    }
}
