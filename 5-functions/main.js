const ALIVE = 1;
const ALIVE_COLOR = "#9bf09d";
const BOARD_COLUMNS = 70;
const BOARD_ROWS = 70;
const CELL_SQUARE_PIXELS = 10;
const DEAD = 0;
const DEAD_COLOR = "#4b7248";
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
  setCellDead(board, column, row);
  setCellDead(nextBoard, column, row);
  if (canBorn()) {
    setCellAlive(board, column, row);
  }
}
function canBorn() {
  const randomLifeProbability = Math.random();
  return randomLifeProbability > LIFE_PROBABILITY;
}
function loopGame() {
  updateIteration(board);
  drawBoardOnCanvas(board);
  stopOrKeepIterations();
}
function stopOrKeepIterations() {
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
function updateIteration(board) {
  setNewGeneration(board);
  cloneBoard(board, nextBoard);
}
function setNewGeneration(board) {
  for (let column = 0; column < BOARD_COLUMNS; column++) {
    for (let row = 0; row < BOARD_ROWS; row++) {
      generateFromCell(board, column, row);
    }
  }
}
function generateFromCell(board, column, row) {
  const livingNeighbors = countLivingNeighbors(
    board,
    column,
    row
  );
  if (isCellDead(board, column, row)) {
    generateFromDeadCell(livingNeighbors, column, row);
  } else {
    generateFromLivingCell(livingNeighbors, column, row);
  }
}
function generateFromDeadCell(livingNeighbors, column, row) {
  if (mustBorn(livingNeighbors)) {
    setCellAlive(nextBoard, column, row);
  }
}
function generateFromLivingCell(livingNeighbors, column, row) {
  if (mustDie(livingNeighbors)) {
    setCellDead(nextBoard, column, row);
  } else {
    setCellAlive(nextBoard, column, row);
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
function drawBoardOnCanvas(board) {
  setUpCanvas();
  for (let column = 0; column < BOARD_COLUMNS; column++) {
    for (let row = 0; row < BOARD_ROWS; row++) {
      fillCell(board, column, row);
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
function fillCell(board, column, row) {
  if (isCellAlive(board, column, row)) {
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
function countLivingNeighbors(board, column, row) {
  const livingAround = getLivingCellsAround(board, column, row);
  let livingNeighbors = livingAround;
  if (isCellAlive(board, column, row)) {
    return (livingNeighbors = livingAround - 1);
  }
  return livingNeighbors;
}
function getLivingCellsAround(board, column, row) {
  let livingAround = 0;
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      livingAround += countIfAlive(board, column + x, row + y);
    }
  }
  return livingAround;
}
function countIfAlive(board, column, row) {
  if (isCellOnBoard(column, row)) {
    if (isCellAlive(board, column, row)) {
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
function isCellAlive(board, column, row) {
  return board[column][row] == ALIVE;
}
function isCellDead(board, column, row) {
  return board[column][row] == DEAD;
}
function setCellAlive(board, column, row) {
  board[column][row] = ALIVE;
}
function setCellDead(board, column, row) {
  board[column][row] = DEAD;
}
// FOR TESTING PURPOSES
export const game = {
  ALIVE,
  BOARD_COLUMNS,
  BOARD_ROWS,
  board,
  countLivingNeighbors,
  DEAD,
  initializeBoard,
  loopGame,
  nextBoard,
  OVER_POPULATION,
  REPRODUCTION_POPULATION,
  UNDER_POPULATION,
  updateIteration
};
