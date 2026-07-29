// Grab a reference to the empty board div from index.html
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

const puzzle = [
    1, 0, 0, 0, 0, 7, 0, 9, 0,
    0, 3, 0, 0, 2, 0, 0, 0, 8,
    0, 0, 9, 6, 0, 0, 5, 0, 0,

    0, 0, 5, 3, 0, 0, 9, 0, 0,
    0, 1, 0, 0, 8, 0, 0, 0, 2,
    6, 0, 0, 0, 0, 4, 0, 0, 0,

    3, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 4, 0, 0, 0, 0, 0, 0, 7,
    0, 0, 7, 0, 0, 0, 3, 0, 0
];

const currentBoard = [...puzzle];

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
    } if (puzzle[i] == 0) {
        cell.textContent = ""

        cell.addEventListener("click", () => {
            // Remove highlight from whichever cell was previously selected
            if (selectedCell) selectedCell.classList.remove("selected");

            // Mark this cell as the new selection
            selectedCell = cell;
            cell.classList.add("selected");
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