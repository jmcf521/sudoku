// Grab a reference to the empty board div from index.html
const board = document.getElementById("board");

// Build 81 cells (9x9) and add them to the board in order, left to right, top to bottom
for (let i = 0; i < 81; i++) {
  // Create a new empty div for this cell
  const cell = document.createElement("div");

  // Give it the "cell" class so style.css can style it
  cell.classList.add("cell");

  // Store this cell's position (0-80) on the element itself, for later use in game logic
  cell.dataset.index = i;

  // Add the finished cell into the board container
  board.appendChild(cell);
}