// Very simple test puzzle
const puzzle = [
    1, 0, 3, 0, 5, 6, 0, 8, 9,
    4, 5, 0, 7, 8, 0, 1, 2, 0,
    0, 8, 9, 0, 2, 3, 0, 5, 6,

    2, 0, 1, 5, 0, 4, 8, 0, 7,
    5, 6, 0, 8, 9, 0, 2, 3, 0,
    0, 9, 7, 0, 3, 1, 0, 6, 4,

    3, 0, 2, 6, 0, 5, 9, 0, 8,
    6, 4, 0, 9, 7, 0, 3, 1, 0,
    0, 7, 8, 0, 1, 2, 0, 4, 5
];

// AI Escargot 
const hardpuzzle = [
    1, 0, 0, 0, 0, 7, 0, 9, 0,
    0, 3, 0, 0, 2, 0, 0, 0, 8,
    0, 0, 9, 6, 0, 0, 5, 0, 0,

    0, 0, 5, 3, 0, 0, 9, 0, 0,
    0, 1, 0, 0, 8, 0, 0, 0, 2,
    6, 0, 0, 0, 0, 4, 0, 0, 0,

    3, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 4, 0, 0, 0, 0, 0, 0, 7,
    0, 0, 7, 0, 0, 0, 3, 0, 0
]

// Human solvable hard puzzle
const humanpuzzle = [
    5, 3, 0, 0, 7, 0, 0, 0, 0,
    6, 0, 0, 1, 9, 5, 0, 0, 0,
    0, 9, 8, 0, 0, 0, 0, 6, 0,

    8, 0, 0, 0, 6, 0, 0, 0, 3,
    4, 0, 0, 8, 0, 3, 0, 0, 1,
    7, 0, 0, 0, 2, 0, 0, 0, 6,

    0, 6, 0, 0, 0, 0, 2, 8, 0,
    0, 0, 0, 4, 1, 9, 0, 0, 5,
    0, 0, 0, 0, 8, 0, 0, 7, 9
];

// ans31
const anspuzzle = [
    0, 0, 0, 9, 0, 0, 0, 0, 0,
    9, 0, 0, 0, 0, 6, 2, 4, 0,
    5, 0, 0, 0, 4, 3, 0, 1, 7,

    0, 6, 5, 0, 3, 0, 0, 0, 0,
    1, 0, 0, 5, 0, 9, 0, 0, 2,
    0, 0, 0, 0, 2, 0, 1, 6, 0,

    6, 5, 0, 3, 8, 0, 0, 0, 9,
    0, 9, 8, 6, 0, 0, 0, 0, 3,
    0, 0, 0, 0, 0, 5, 0, 0, 0
];



// Copy of current board so original does not need to be modified
const currentBoard = [...puzzle];
const solvedBoard = [...puzzle];
solve(solvedBoard);
// console.log(solvedBoard);

// Grab a reference to the empty board and number pad divs from index.html
// Create variables for info about what is selected
const board = document.getElementById("board");
const numberPad = document.getElementById("number-pad");
const options = document.getElementById("options");
const optionsLabels = ["Input Num", "Input Note", "Label", "Clear Cell",];
let selectedCell = null;
let selectedButton = null;
let selectedOption = optionsLabels[0];
let lastNotation = 0;
//let selectedNumber = null;

// Build 81 cells (9x9) and add them to the board in order, left to right, top to bottom
for (let i = 0; i < 81; i++) {
    // Create cell
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;

    // Create div in cell for input
    const numDiv = document.createElement("div");
    numDiv.classList.add("cell-value");

    // create div in cell for notes
    const notesDiv = document.createElement("div");
    notesDiv.classList.add("cell-notes");

    // Create 9 note spans in notesDiv
    for (let num = 1; num <= 9; num++) {
        const note = document.createElement("span");
        note.classList.add("note");
        note.dataset.num = num;
        notesDiv.appendChild(note);
    }

    // Attach both containers to the cell
    cell.appendChild(numDiv);
    cell.appendChild(notesDiv);

    if (puzzle[i] !== 0) {
        numDiv.textContent = puzzle[i];
        cell.classList.add("given");
    }

    board.appendChild(cell);
}

// Build numberpad under numbers
for (let num = 1; num <= 9; num++) {
    const button = document.createElement("button");
    button.classList.add("num-button");
    button.textContent = num;
    numberPad.appendChild(button);
}

for (let num = 0; num < optionsLabels.length; num++) {
    const button = document.createElement("button");
    button.classList.add("options-button");
    if (num == 0) button.classList.add("active-mode");
    button.textContent = optionsLabels[num];
    options.appendChild(button);
}

// Event listener for clicks in grid boxes
board.addEventListener("click", (event) => {
    // Create variable with clicked element
    let cell = event.target;
    
    if (cell.classList.contains("cell-notes") || cell.classList.contains("cell-value")) {
        cell = cell.parentElement;
    }

    // Ignore clicks that land on the board but not on an actual cell (e.g. gaps, if any)
    if (!cell.classList.contains("cell")) return;
    updateSelection(cell);
});

// Event listener for clicks on numberPad
numberPad.addEventListener("click", (event) => {
    const numButton = event.target;

    if (!numButton.classList.contains("num-button")) return;

    if (selectedOption === "Label") {
        console.log("highlight mode");
        clearSelection();
        selectedButton = event.target;
        highlightAll(currentBoard, parseInt(event.target.textContent));
    }

    if (selectedOption === "Input Num") {
        console.log("number mode");
        if (selectedCell) placeNumber(parseInt(event.target.textContent));
    }



});

// Event listener for clicks on options
options.addEventListener("click", (event) => {
    const label = event.target.textContent;
    const optionsButton = event.target;

    if (!optionsButton.classList.contains("options-button")) return;

    // These are one-shot actions -- do something immediately, don't change mode
    if (label === optionsLabels[optionsLabels.length - 1]) {
        // Clear Cell
        if (selectedCell) placeNumber("");
        return;
    }

    // Everything else is a mode toggle -- Input Num, Input Note, Label (for now)
    if (label === optionsLabels[1]) {
        lastNotation = 1;
        highlightCross();
    }
    if (label === optionsLabels[0]) {
        lastNotation = 0;
        highlightCross();
    }
    if (label === optionsLabels[2]) {
        if (selectedCell) {
            if (selectedCell.textContent != "") {
                highlightAll(currentBoard, parseInt(selectedCell.textContent));
            } else {
                clearSelection();
            }
        }
    }
    setMode(label, event.target);
});

// Event listener key inputs
document.addEventListener("keydown", (event) => {
    // Do nothing if no cell or no button is selected
    if (!selectedCell) return;

    // Let esc deselect cell
    if (event.key === "Escape") {
        clearSelection();
        return;
    }

    if (!selectedCell.classList.contains("given")) {
        // event.key is the actual character pressed, as a string -- e.g. "5"
        if (event.key >= "1" && event.key <= "9") {
            placeNumber(parseInt(event.key));
        }

        // Let Backspace/Delete clear the cell
        if (event.key === "Backspace" || event.key === "Delete") {
            placeNumber("");
        }
    }

    if (event.key === "ArrowUp") {
        selectAbove();
    }

    if (event.key === "ArrowDown") {
        selectBelow();
    }

    if (event.key === "ArrowRight") {
        selectRight();
    }

    if (event.key === "ArrowLeft") {
        selectLeft();
    }

});

// Function to place number
function placeNumber(num) {
    if (!selectedCell || selectedCell.classList.contains("given")) return;

    const index = parseInt(selectedCell.dataset.index);

    // Clear cell and update conflicts
    if (num == "") {
        currentBoard[index] = 0;
        selectedCell.textContent = "";
        selectedCell.classList.remove("invalid");
        selectedCell.classList.remove("input");
        highlightInvalid();
        highlightCross()
        return;
    }

    // Update cell with valid num
    currentBoard[index] = num;
    selectedCell.textContent = num;
    highlightInvalid();
    highlightNum(num);
    selectedCell.classList.add("input");

    const equalArrays = (a, b) =>
        a.length === b.length && a.every((val, index) => val === b[index]);

    if (equalArrays(solvedBoard, currentBoard)) {
        console.log(equalArrays);
        for (let i = 0; i < 81; i++) {
            if (board.children[i].classList.contains("given")) board.children[i].classList.add("solved");
        }
    } else {
        for (let i = 0; i < 81; i++) {
            board.children[i].classList.remove("solved");
        }
    }

}

function updateSelection(cell) {
    clearSelection();
    selectedCell = cell;
    cell.classList.add("selected-cell");

    if (selectedOption == optionsLabels[0]) {
        highlightCross();
    }

    if (selectedOption == optionsLabels[1]) {
        highlightCross();
    }

    if (selectedOption == optionsLabels[2]) { // && 
        if (cell.classList.contains("given") || cell.classList.contains("input") ) {
            highlightAll(currentBoard, parseInt(selectedCell.textContent));
            return;
        }
        if (options.children[0].textContent === optionsLabels[lastNotation]) {
            highlightCross();
            setMode(optionsLabels[lastNotation], options.children[0]);
        }
        if (options.children[1].textContent === optionsLabels[lastNotation]) {
            highlightCross();
            setMode(optionsLabels[lastNotation], options.children[1]);
        }
    }

    // Highlight column and row of selected cell

}

// Remove highlights and selected cell
function clearSelection() {
    highlightRemove();
    if (selectedCell) selectedCell.classList.remove("selected-cell");
    selectedCell = null;
    // selectedButton = null;
}

// Highlight all boxes that cannot have num and all boxes with same num as selected cell
function highlightAll(board, num) {
    for (let i = 0; i < 81; i++) {
        if (board[i] === num) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            highlightCol(col);
            highlightRow(row);
            highlightBox(row, col);
            highlightNum(num);
            highlightInputs();
        }
    }
}

// Highlight column and row of selected cell and all cells with same num of selected cell
function highlightCross() {

    if (!selectedCell) return;

    const selectedIndex = parseInt(selectedCell.dataset.index);
    const selectedRow = Math.floor(selectedIndex / 9);
    const selectedCol = selectedIndex % 9;
    const givenNum = parseInt(selectedCell.textContent);

    highlightRow(selectedRow);
    highlightCol(selectedCol);
    highlightNum(givenNum);
}

// Highlight selectedRow
function highlightRow(selectedRow) {
    for (let c = 0; c < 9; c++) {
        const i = selectedRow * 9 + c;
        highlightApply(i)
    }
}

// Highlight selectedCol
function highlightCol(selectedCol) {
    for (let r = 0; r < 9; r++) {
        const i = r * 9 + selectedCol;
        highlightApply(i)
    }
}

// Highlight box starting at selectedRow and selectedCol
function highlightBox(selectedRow, selectedCol) {
    const boxRow = Math.floor(selectedRow / 3) * 3;
    const boxCol = Math.floor(selectedCol / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            const i = r * 9 + c;
            highlightApply(i)
        }
    }
}

function highlightApply(i) {
    if (!board.children[i].classList.contains("selected-cell")) board.children[i].classList.add("highlighted-cell");
    if (board.children[i].classList.contains("input")) board.children[i].classList.add("highlighted-input");
    if (board.children[i].classList.contains("given")) board.children[i].classList.add("highlighted-given");
}

// Highlight all cells matching num
function highlightNum(num) {
    for (let i = 0; i < 81; i++) {
        if (parseInt(board.children[i].textContent) == num) {
            board.children[i].classList.add("selected-cell");
        } else if (selectedCell != board.children[i]) {
            board.children[i].classList.remove("selected-cell");
        }
    }
}

// Highlight cells that are not empty or given
function highlightInputs() {
    for (let i = 0; i < 81; i++) {
        if (board.children[i].textContent != "" && !board.children[i].classList.contains("given")) { 
            board.children[i].classList.add("highlighted-input");
        }
    }
}

// Check each cell and if it is invalid add invalid class
function highlightInvalid() {
    for (let i = 0; i < 81; i++) {
        board.children[i].classList.remove("invalid");
        if (!isValid(currentBoard, i, parseInt(currentBoard[i]))) {
            board.children[i].classList.add("invalid");
        }
    }
}

//Clear highlighting classes from all cells
function highlightRemove() {
    for (let i = 0; i < 81; i++) {
        board.children[i].classList.remove("highlighted-cell");
        board.children[i].classList.remove("highlighted-input");
        board.children[i].classList.remove("highlighted-given");
        board.children[i].classList.remove("selected-cell");
    }
}

function selectAbove() {
    const row = Math.floor(parseInt(selectedCell.dataset.index) / 9);
    const col = parseInt(selectedCell.dataset.index) % 9;
    const newIndex = 9 * (row - 1) + col;
    if (newIndex >= 0) updateSelection(board.children[newIndex]);
}

function selectBelow() {
    const row = Math.floor(parseInt(selectedCell.dataset.index) / 9);
    const col = parseInt(selectedCell.dataset.index) % 9;
    const newIndex = 9 * (row + 1) + col;
    if (newIndex <= 80) updateSelection(board.children[newIndex]);
}

function selectLeft() {
    const row = Math.floor(parseInt(selectedCell.dataset.index) / 9);
    const col = parseInt(selectedCell.dataset.index) % 9;
    const newIndex = row * 9 + (col - 1);
    if (newIndex >= 0 && newIndex % 9 != 8) updateSelection(board.children[newIndex]);
}

function selectRight() {
    const row = Math.floor(parseInt(selectedCell.dataset.index) / 9);
    const col = parseInt(selectedCell.dataset.index) % 9;
    const newIndex = row * 9 + (col + 1);
    if (newIndex <= 80 && newIndex % 9 != 0) updateSelection(board.children[newIndex]);
}

// Sets the current input mode and updates which button looks "active"
function setMode(mode, button) {
    // Remove the active look from whichever button was previously active
    document.querySelectorAll(".options-button").forEach(btn => {
        btn.classList.remove("active-mode");
    });

    selectedOption = mode;
    button.classList.add("active-mode");
}
