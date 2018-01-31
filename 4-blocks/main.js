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
    initializeColumnRow(column, row);
  }
}
function initializeColumnRow(column, row) {
  board[column][row] = DEAD;
  nextBoard[column][row] = DEAD;
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
  } else {
    setTimeout(loopGame, DELAY_MS);
  }
}
function updateIteration() {
  generateNextCellState();
}
function generateNextCellState() {
  for (let column = 0; column < BOARD_COLUMNS; column++) {
    for (let row = 0; row < BOARD_ROWS; row++) {
      generateFromCell(column, row);
    }
  }
  cloneToCurrentBoard(board, nextBoard);
}
function generateFromCell(column, row) {
  const livingNeighbors = countLifeAround(column, row);
  if (board[column][row] == DEAD) {
    generateFromDeadCell(livingNeighbors, column, row);
  } else {
    generateFromLivingCell(livingNeighbors, column, row);
  }
}
function generateFromDeadCell(livingNeighbors, column, row) {
  if (livingNeighbors == REPRODUCTION_POPULATION) {
    nextBoard[column][row] = ALIVE;
  }
}
function generateFromLivingCell(livingNeighbors, column, row) {
  if (
    livingNeighbors < UNDER_POPULATION ||
    livingNeighbors > OVER_POPULATION
  ) {
    nextBoard[column][row] = DEAD;
  } else {
    nextBoard[column][row] = ALIVE;
  }
}
function cloneToCurrentBoard(target, source) {
  for (let column = 0; column < BOARD_COLUMNS; column++) {
    for (let row = 0; row < BOARD_ROWS; row++) {
      target[column][row] = source[column][row];
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
  const leftColumn = column - 1;
  const rightColumn = column + 1;
  const topRow = row - 1;
  const bottomRow = row + 1;
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

// FOR TESTING PURPOSES
export const game = {
  ALIVE,
  BOARD_COLUMNS,
  BOARD_ROWS,
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
