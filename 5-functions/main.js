const ALIVE = 1;
const ALIVE_COLOR = "#f8ed62";
const BOARD_COLUMNS = 70;
const BOARD_ROWS = 70;
const CELL_SQUARE_PIXELS = 10;
const DEAD = 0;
const DEAD_COLOR = "#a98600";
const DELAY_MS = 50;
const LIFE_PROBABILITY = 0.44;
const MINUTE_MS = 60 * 1000;
const LIVE_GAME_MS = MINUTE_MS;
const OVER_POPULATION = 3;
const REPRODUCTION_POPULATION = 3;
const UNDER_POPULATION = 2;
const initializationTime = Date.now();
const board = [];
const nextBoard = [];
const boardCanvas = document.getElementById("gameCanvas");
const canvasContext = boardCanvas.getContext("2d");

function start() {
  initializeBoard();
  loopGame();
}
function initializeBoard() {
  for (let column = 0; column < BOARD_COLUMNS; column++) {
    initializeColumn(column);
  }
}
function initializeColumn(column) {
  board[column] = [];
  nextBoard[column] = [];
  for (let row = 0; row < BOARD_ROWS; row++) {
    initializeCell(column, row);
  }
}
function initializeCell(column, row) {
  board[column][row] = DEAD;
  nextBoard[column][row] = DEAD;
  if (canBorn()) {
    setCellAlive(column, row);
  }
}
function canBorn() {
  const randomLifeProbability = Math.random();
  return randomLifeProbability > LIFE_PROBABILITY;
}
function loopGame() {
  updateIteration();
  drawBoardOnCanvas();
  stopOrKeepTesting();
}
function stopOrKeepTesting() {
  if (isOverTime()) {
    return;
  } else {
    setTimeout(loopGame, DELAY_MS);
  }
}
function isOverTime() {
  const now = Date.now();
  const timeRunning = now - initializationTime;
  return timeRunning > LIVE_GAME_MS;
}
function updateIteration() {
  setNewGeneration();
  cloneBoard(board, nextBoard);
}
function setNewGeneration() {
  for (let column = 0; column < BOARD_COLUMNS; column++) {
    for (let row = 0; row < BOARD_ROWS; row++) {
      generateFromCell(column, row);
    }
  }
}
function generateFromCell(column, row) {
  const livingNeighbors = countLivingNeighbors(column, row);
  if (isCellDead(column, row)) {
    generateFromDeadCell(livingNeighbors, column, row);
  } else {
    generateFromLivingCell(livingNeighbors, column, row);
  }
}
function generateFromDeadCell(livingNeighbors, column, row) {
  if (mustBorn(livingNeighbors)) {
    nextBoard[column][row] = ALIVE;
  }
}
function generateFromLivingCell(livingNeighbors, column, row) {
  if (mustDie(livingNeighbors)) {
    nextBoard[column][row] = DEAD;
  } else {
    nextBoard[column][row] = ALIVE;
  }
}
function mustBorn(livingNeighbors) {
  return livingNeighbors == REPRODUCTION_POPULATION;
}
function mustDie(livingNeighbors) {
  return (
    livingNeighbors < UNDER_POPULATION ||
    livingNeighbors > OVER_POPULATION
  );
}
function cloneBoard(clonedBoard, currentBoard) {
  for (let column = 0; column < BOARD_COLUMNS; column++) {
    for (let row = 0; row < BOARD_ROWS; row++) {
      clonedBoard[column][row] = currentBoard[column][row];
    }
  }
}
function drawBoardOnCanvas() {
  setUpCanvas();
  for (let column = 0; column < BOARD_COLUMNS; column++) {
    for (let row = 0; row < BOARD_ROWS; row++) {
      fillCell(column, row);
    }
  }
}
function setUpCanvas() {
  boardCanvas.width = BOARD_COLUMNS * CELL_SQUARE_PIXELS;
  boardCanvas.height = BOARD_ROWS * CELL_SQUARE_PIXELS;
  boardCanvas.style.width = boardCanvas.width;
  boardCanvas.style.height = boardCanvas.height;
  clearCanvas();
}
function clearCanvas() {
  canvasContext.fillStyle = DEAD_COLOR;
  canvasContext.fillRect(
    0,
    0,
    boardCanvas.width,
    boardCanvas.height
  );
}
function fillCell(column, row) {
  if (isCellAlive(column, row)) {
    fillLivingCell(column, row);
  }
}
function fillLivingCell(column, row) {
  canvasContext.fillStyle = ALIVE_COLOR;
  canvasContext.fillRect(
    column * CELL_SQUARE_PIXELS,
    row * CELL_SQUARE_PIXELS,
    CELL_SQUARE_PIXELS,
    CELL_SQUARE_PIXELS
  );
}
function countLivingNeighbors(column, row) {
  const livingAround = geLivingCellsAround(column, row);
  let livingNeighbors = livingAround;
  if (isCellAlive(column, row)) {
    return (livingNeighbors = livingAround - 1);
  }
  return livingNeighbors;
}
function geLivingCellsAround(column, row) {
  let livingAround = 0;
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      livingAround += countIfAlive(column + x, row + y);
    }
  }
  return livingAround;
}
function countIfAlive(column, row) {
  if (isCellOnBoard(column, row)) {
    if (isCellAlive(column, row)) {
      return 1;
    }
  }
  return 0;
}
function isCellOnBoard(column, row) {
  return (
    column >= 0 &&
    column < BOARD_COLUMNS &&
    row >= 0 &&
    row < BOARD_ROWS
  );
}
function isCellAlive(column, row) {
  return board[column][row] == ALIVE;
}
function isCellDead(column, row) {
  return board[column][row] == DEAD;
}
function setCellAlive(column, row) {
  board[column][row] = ALIVE;
}
function setCellDead(column, row) {
  board[column][row] = DEAD;
}
// FOR TESTING PURPOSES
export const game = {
  BOARD_COLUMNS,
  BOARD_ROWS,
  board,
  countLivingNeighbors,
  initializeBoard,
  loopGame,
  nextBoard,
  updateIteration
};
