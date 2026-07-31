// Very simple test puzzle
const easypuzzle = [
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
const puzzle = [
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

// Copy of current board so original does not need to be modified
const currentBoard = [...puzzle];

// Grab a reference to the empty board and number pad divs from index.html
// Create variables for info about what is selected
const board = document.getElementById("board");
const numberPad = document.getElementById("number-pad");
let selectedCell = null;
let selectedButton = null;
let selectedNumber = null;

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
    } if (puzzle[i] == 0) {
        // Show as blank cell
        cell.textContent = ""
    }

    // Add the finished cell into the board container
    board.appendChild(cell);
}

// Build numberpad under numbers
for (let num = 1; num <= 9; num++) {
    const button = document.createElement("button");
    button.classList.add("num-button");
    button.textContent = num;
    numberPad.appendChild(button);
}

// Event listener for clicks in grid boxes
board.addEventListener("click", (event) => {
    // Create variable with clicked element
    const cell = event.target;

    // Ignore clicks that land on the board but not on an actual cell (e.g. gaps, if any)
    if (!cell.classList.contains("cell")) return;

    updateSelection(cell);
});

// Event listener for clicks on buttons
numberPad.addEventListener("click", (event) => {
    if (selectedCell) {
        clearSelection();
    }
    selectedButton = event.target;
    highlightAll(currentBoard, parseInt(event.target.textContent));
});

// Event listener key inputs
document.addEventListener("keydown", (event) => {
    // Do nothing if no cell or no button is selected
    if (!selectedCell && !selectedButton) return;

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
            const index = parseInt(selectedCell.dataset.index);
            currentBoard[index] = 0;
            selectedCell.textContent = "";
            selectedCell.classList.remove("invalid");
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
    const index = parseInt(selectedCell.dataset.index);

    if (isValid(currentBoard, index, num)) {
        currentBoard[index] = num;
        selectedCell.textContent = num;
        selectedCell.classList.remove("invalid");
    } else {
        currentBoard[index] = num;
        selectedCell.textContent = num;
        selectedCell.classList.add("invalid");
    }
}

function updateSelection(cell) {
    if (selectedCell) {
        clearSelection();
    }

    // Mark this cell as the new selection
    selectedCell = cell;
    cell.classList.add("selected-num");

    // Highlight column and row of selected cell
    highlightCross();
}

// Remove highlights and selected cell
function clearSelection() {
    removeHighlight();
    selectedCell.classList.remove("selected-num");
    selectedCell = null;
    selectedButton = null;
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
    const selectedIndex = parseInt(selectedCell.dataset.index);
    const selectedRow = Math.floor(selectedIndex / 9);
    const selectedCol = selectedIndex % 9;
    const givenNum = parseInt(selectedCell.textContent);

    highlightRow(selectedRow);
    highlightCol(selectedCol);
    highlightNum(givenNum);
    highlightInputs();
    // highlightBox(selectedRow, selectedCol);
}

// Highlight selectedRow
function highlightRow(selectedRow) {
    for (let c = 0; c < 9; c++) {
        const i = selectedRow * 9 + c;
        if (!board.children[i].classList.contains("selected-num")) board.children[i].classList.add("highlighted");
        if (board.children[i].classList.contains("given")) board.children[i].classList.add("highlighted-given");
    }
}

// Highlight selectedCol
function highlightCol(selectedCol) {
    for (let r = 0; r < 9; r++) {
        const i = r * 9 + selectedCol;
        if (!board.children[i].classList.contains("selected-num")) board.children[i].classList.add("highlighted");
        if (board.children[i].classList.contains("given")) board.children[i].classList.add("highlighted-given");
    }
}

// Highlight box starting at selectedRow and selectedCol
function highlightBox(selectedRow, selectedCol) {
    const boxRow = Math.floor(selectedRow / 3) * 3;
    const boxCol = Math.floor(selectedCol / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            const i = r * 9 + c;
            if (!board.children[i].classList.contains("selected-num")) board.children[i].classList.add("highlighted");
            if (board.children[i].classList.contains("given")) board.children[i].classList.add("highlighted-given");
        }
    }
}

// Highlight all cells matching num
function highlightNum(num) {
    for (let i = 0; i < 81; i++) {
        if (parseInt(board.children[i].textContent) == num) {
            board.children[i].classList.add("selected-num");
        }
    }
}

// Highlight cells that are not empty or given
function highlightInputs() {
    for (let i = 0; i < 81; i++) {
        if (board.children[i].textContent != "" && !board.children[i].classList.contains("given")) {
            board.children[i].classList.add("highlighted");
        }
    }
}

function removeHighlight() {
    for (let i = 0; i < 81; i++) {
        board.children[i].classList.remove("highlighted");
        board.children[i].classList.remove("highlighted-given");
        board.children[i].classList.remove("selected-num");
    }
}

function selectAbove() {
    const row = Math.floor(parseInt(selectedCell.dataset.index) / 9);
    const col = parseInt(selectedCell.dataset.index) % 9;
    const newIndex = 9 * (row - 1) + col;
    if (newIndex >= 0) updateSelection(board.children[newIndex]);
}

function selectBelow () {
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