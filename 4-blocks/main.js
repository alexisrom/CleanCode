const ALIVE = 1;
const ALIVE_COLOR = "#f8ed62";
const COLUMNS = 140;
const ROWS = 70;
const CELL_SQUARE_PIXELS = 10;
const DEAD = 0;
const DEAD_COLOR = "#a98600";
const DELAY_MS = 50;
const INIT_COLUMN = 0;
const INIT_ROW = 0;
const LIFE_PROBABILITY = 0.44;
const MINUTE_MS = 60 * 1000;
const LIVE_GAME_MS = MINUTE_MS;
const OVER_POPULATION = 3;
const REPRODUCTION_POPULATION = 3;
const UNDER_POPULATION = 2;
const initializationTime = Date.now();
const board = [];
const nextStateBoard = [];
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
  nextStateBoard[column] = [];
  for (let row = INIT_ROW; row < ROWS; row++) {
    initializeColumnRow(column, row);
  }
}
function initializeColumnRow(column, row) {
  board[column][row] = DEAD;
  nextStateBoard[column][row] = DEAD;
  const randomLifeProbability = Math.random();
  if (randomLifeProbability > LIFE_PROBABILITY) {
    board[column][row] = ALIVE;
  }
}
function loopGame() {
  updateIteration();
  drawBoardOnCanvas();
  stopOrKeepIterations();
}
function stopOrKeepIterations() {
  const now = Date.now();
  if (now - initializationTime > LIVE_GAME_MS) {
    return;
  }
  setTimeout(loopGame, DELAY_MS);
}
function updateIteration() {
  generateNextCellState();
}
function generateNextCellState() {
  for (let column = INIT_COLUMN; column < COLUMNS; column++) {
    for (let row = INIT_ROW; row < ROWS; row++) {
      generateFromCell(column, row);
    }
  }
  cloneToCurrentBoard(board, nextStateBoard);
}
function generateFromCell(column, row) {
  const lifeAround = countLifeAround(column, row);
  if (board[column][row] == DEAD) {
    generateFromDeadCell(lifeAround, column, row);
  } else {
    generateFromLivingCell(lifeAround, column, row);
  }
}
function generateFromDeadCell(lifeAround, column, row) {
  if (lifeAround == REPRODUCTION_POPULATION) {
    nextStateBoard[column][row] = ALIVE;
  }
}
function generateFromLivingCell(lifeAround, column, row) {
  if (
    lifeAround < UNDER_POPULATION ||
    lifeAround > OVER_POPULATION
  ) {
    nextStateBoard[column][row] = DEAD;
  } else {
    nextStateBoard[column][row] = ALIVE;
  }
}
function cloneToCurrentBoard(target, source) {
  for (let column = INIT_COLUMN; column < COLUMNS; column++) {
    for (let row = INIT_ROW; row < ROWS; row++) {
      target[column][row] = source[column][row];
    }
  }
}
function drawBoardOnCanvas() {
  setUpCanvas();
  for (let column = INIT_COLUMN; column < COLUMNS; column++) {
    for (let row = INIT_ROW; row < ROWS; row++) {
      fillCell(column, row);
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
  const INIT_WIDTH = 0;
  const INIT_HEIGHT = 0;
  canvasContext.fillStyle = DEAD_COLOR;
  canvasContext.fillRect(
    INIT_WIDTH,
    INIT_HEIGHT,
    boardCanvas.width,
    boardCanvas.height
  );
}
function fillCell(column, row) {
  if (board[column][row] == ALIVE) {
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
function countLifeAround(column, row) {
  let lifeAround = 0;
  const STEP = 1;
  const leftColumn = column - STEP;
  const rightColumn = column + STEP;
  const topRow = row - STEP;
  const bottomRow = row + STEP;
  lifeAround += countIfAlive(leftColumn, topRow);
  lifeAround += countIfAlive(leftColumn, row);
  lifeAround += countIfAlive(leftColumn, bottomRow);
  lifeAround += countIfAlive(column, topRow);
  lifeAround += countIfAlive(column, bottomRow);
  lifeAround += countIfAlive(rightColumn, topRow);
  lifeAround += countIfAlive(rightColumn, row);
  lifeAround += countIfAlive(rightColumn, bottomRow);
  return lifeAround;
}
function countIfAlive(column, row) {
  if (isCellOnBoard(column, row)) {
    if (board[column][row] == ALIVE) {
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
  nextStateBoard,
  OVER_POPULATION,
  REPRODUCTION_POPULATION,
  UNDER_POPULATION,
  updateIteration
};
