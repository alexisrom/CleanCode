import { GAME } from './config/game.js';
import { CANVAS } from './config/canvas.js';
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
  for (let column = 0; column < GAME.BOARD_COLUMNS; column++) {
    initializeColumn(column);
  }
}
function initializeColumn(column) {
  board[column] = [];
  nextBoard[column] = [];
  for (let row = 0; row < GAME.BOARD_ROWS; row++) {
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
  return randomLifeProbability > GAME.LIFE_PROBABILITY;
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
    setTimeout(loopGame, GAME.DELAY_MS);
  }
}
function isOverTime() {
  const now = Date.now();
  const timeRunning = now - initializationTime;
  return timeRunning > GAME.LIVE_GAME_MS;
}
function updateIteration(board) {
  setNewGeneration(board);
  cloneBoard(board, nextBoard);
}
function setNewGeneration(board) {
  for (let column = 0; column < GAME.BOARD_COLUMNS; column++) {
    for (let row = 0; row < GAME.BOARD_ROWS; row++) {
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
  return livingNeighbors == GAME.REPRODUCTION_POPULATION;
}
function mustDie(livingNeighbors) {
  return (
    livingNeighbors < GAME.UNDER_POPULATION ||
    livingNeighbors > GAME.OVER_POPULATION
  );
}
function cloneBoard(clonedBoard, currentBoard) {
  for (let column = 0; column < GAME.BOARD_COLUMNS; column++) {
    for (let row = 0; row < GAME.BOARD_ROWS; row++) {
      clonedBoard[column][row] = currentBoard[column][row];
    }
  }
}
function drawBoardOnCanvas(board) {
  setUpCanvas();
  for (let column = 0; column < GAME.BOARD_COLUMNS; column++) {
    for (let row = 0; row < GAME.BOARD_ROWS; row++) {
      fillCell(board, column, row);
    }
  }
}
function setUpCanvas() {
  boardCanvas.width = GAME.BOARD_COLUMNS * CANVAS.CELL_SQUARE_PXS;
  boardCanvas.height = GAME.BOARD_ROWS * CANVAS.CELL_SQUARE_PXS;
  boardCanvas.style.width = boardCanvas.width;
  boardCanvas.style.height = boardCanvas.height;
  clearCanvas();
}
function clearCanvas() {
  canvasContext.fillStyle = CANVAS.DEAD_COLOR;
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
  canvasContext.fillStyle = CANVAS.ALIVE_COLOR;
  canvasContext.fillRect(
    column * CANVAS.CELL_SQUARE_PXS,
    row * CANVAS.CELL_SQUARE_PXS,
    CANVAS.CELL_SQUARE_PXS,
    CANVAS.CELL_SQUARE_PXS
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
    column < GAME.BOARD_COLUMNS &&
    row >= 0 &&
    row < GAME.BOARD_ROWS
  );
}
function isCellAlive(board, column, row) {
  return board[column][row] == GAME.ALIVE;
}
function isCellDead(board, column, row) {
  return board[column][row] == GAME.DEAD;
}
function setCellAlive(board, column, row) {
  board[column][row] = GAME.ALIVE;
}
function setCellDead(board, column, row) {
  board[column][row] = GAME.DEAD;
}
// FOR TESTING PURPOSES
export const game = {
  CONFIG: GAME,
  board,
  countLivingNeighbors,
  initializeBoard,
  loopGame,
  nextBoard,
  updateIteration
};
