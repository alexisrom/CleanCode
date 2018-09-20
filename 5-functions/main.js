const ALIVE = 1;
const ALIVE_COLOR = "#9bf09d";
const COLUMNS = 140;
const ROWS = 70;
const CELL_SQUARE_PIXELS = 10;
const DEAD = 0;
const DEAD_COLOR = "#4b7248";
const DELAY_MS = 50;
const INIT_COLUMN = 0;
const INIT_HEIGHT = 0;
const INIT_WIDTH = 0;
const INIT_ROW = 0;
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
  for (let column = INIT_COLUMN; column < COLUMNS; column++) {
    initializeColumn(column);
  }
}
function initializeColumn(column) {
  board[column] = [];
  nextBoard[column] = [];
  for (let row = INIT_ROW; row < ROWS; row++) {
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
  generateNextCellState(board);
  cloneToCurrentBoard(board, nextBoard);
}
function generateNextCellState(board) {
  for (let column = INIT_COLUMN; column < COLUMNS; column++) {
    for (let row = INIT_ROW; row < ROWS; row++) {
      generateFromCell(board, column, row);
    }
  }
}
function generateFromCell(board, column, row) {
  const lifeAround = countLifeAround(board, column, row);
  if (isCellDead(board, column, row)) {
    generateFromDeadCell(lifeAround, column, row);
  } else {
    generateFromLivingCell(lifeAround, column, row);
  }
}
function generateFromDeadCell(lifeAround, column, row) {
  if (mustBorn(lifeAround)) {
    setCellAlive(nextBoard, column, row);
  }
}
function generateFromLivingCell(lifeAround, column, row) {
  if (mustDie(lifeAround)) {
    setCellDead(nextBoard, column, row);
  } else {
    setCellAlive(nextBoard, column, row);
  }
}
function mustBorn(lifeAround) {
  return lifeAround == REPRODUCTION_POPULATION;
}
function mustDie(lifeAround) {
  return (
    lifeAround < UNDER_POPULATION ||
    lifeAround > OVER_POPULATION
  );
}
function cloneToCurrentBoard(target, source) {
  for (let column = INIT_COLUMN; column < COLUMNS; column++) {
    for (let row = INIT_ROW; row < ROWS; row++) {
      cloneToCurrentCell(target, column, row, source);
    }
  }
}
function cloneToCurrentCell(target, column, row, source) {
  target[column][row] = source[column][row];
}

function drawBoardOnCanvas(board) {
  setUpCanvas();
  for (let column = INIT_COLUMN; column < COLUMNS; column++) {
    for (let row = INIT_ROW; row < ROWS; row++) {
      fillCell(board, column, row);
    }
  }
}
function setUpCanvas() {
  boardCanvas.width = COLUMNS * CELL_SQUARE_PIXELS;
  boardCanvas.height = ROWS * CELL_SQUARE_PIXELS;
  boardCanvas.style.width = boardCanvas.width;
  boardCanvas.style.height = boardCanvas.height;
  clearCanvas();
}
function clearCanvas() {
  canvasContext.fillStyle = DEAD_COLOR;
  canvasContext.fillRect(
    INIT_WIDTH,
    INIT_HEIGHT,
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
function countLifeAround(board, column, row) {
  const livingAround = getLivingCellsAround(board, column, row);
  if (isCellAlive(board, column, row)) {
    return deductItself(livingAround);
  }
  return livingAround;
}
function deductItself(livingAround) {
  return livingAround - 1;
}
function getLivingCellsAround(board, column, row) {
  let lifeAround = 0;
  const previous = -1;
  const next = 2;
  for (let xStep = previous; xStep < next; xStep++) {
    for (let yStep = previous; yStep < next; yStep++) {
      lifeAround += countIfNeighborIsAlive(
        board,
        column + xStep,
        row + yStep
      );
    }
  }
  return lifeAround;
}
function countIfNeighborIsAlive(board, column, row) {
  if (isCellOnBoard(column, row)) {
    if (isCellAlive(board, column, row)) {
      return ALIVE;
    }
  }
  return DEAD;
}
function isCellOnBoard(column, row) {
  return (
    column >= INIT_COLUMN &&
    column < COLUMNS &&
    row >= INIT_ROW &&
    row < ROWS
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
  COLUMNS,
  ROWS,
  board,
  countLifeAround,
  DEAD,
  initializeBoard,
  loopGame,
  nextBoard,
  OVER_POPULATION,
  REPRODUCTION_POPULATION,
  UNDER_POPULATION,
  updateIteration
};
