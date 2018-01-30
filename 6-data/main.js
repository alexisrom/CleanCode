import { GAME } from './config/game.js';
import { CANVAS } from './config/canvas.js';
import { Board } from './database/board.js';
import { Index } from './database/index.js';
const initializationTime = Date.now();
const board = new Board(GAME.BOARD_COLUMNS, GAME.BOARD_ROWS);
const nextBoard = [];
const boardCanvas = document.getElementById("gameCanvas");
const canvasContext = boardCanvas.getContext("2d");

function start() {
  initializeBoard();
  loopGame();
}
function initializeBoard() {
  this.board.forEach(initializeCell);
}

function initializeCell(cell) {
  cell.status.former = GAME.DEAD;
  if (canBorn()) {
    setCellAlive(cell);
  } else {
    setCellDead(cell);
  }
}
function canBorn() {
  const randomLifeProbability = Math.random();
  return randomLifeProbability > GAME.LIFE_PROBABILITY;
}
function loopGame() {
  updateIteration(board);
  // drawBoardOnCanvas(board);
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
}
function setNewGeneration(board) {
  board.forEach(generateFromCell);
}
function generateFromCell(cell, index, board) {
  setLifeAround(cell, index, board);
  if (isCellDead(cell)) {
    generateFromDeadCell(cell);
  } else {
    generateFromLivingCell(cell);
  }
}
function setLifeAround(cell, index, board) {
  let lifeAround = 0;
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      lifeAround += countIfAlive(board, index.column + x, index.row + y);
    }
  }
  cell.lifeAround = lifeAround;
}

function generateFromDeadCell(cell) {
  if (mustBorn(cell)) {
    setCellAlive(cell);
  }
}
function generateFromLivingCell(cell) {
  if (mustDie(cell)) {
    setCellDead(cell);
  } else {
    setCellAlive(cell);
  }
}
function mustBorn(cell) {
  return cell.status.lifeAround == GAME.REPRODUCTION_POPULATION;
}
function mustDie(cell) {
  return (
    cell.status.lifeAround < GAME.UNDER_POPULATION ||
    cell.status.lifeAround > GAME.OVER_POPULATION
  );
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
function countIfAlive(board, column, row) {
  const index = new Index(column, row);
  if (board.isOnBoard(index)) {
    const cell = board.getItem(index);
    if (isCellAlive(cell)) {
      return 1;
    }
  }
  return 0;
}

function isCellAlive(cell) {
  return cell.status.current == GAME.ALIVE;
}
function isCellDead(cell) {
  return cell.status.current == GAME.DEAD;
}
function setCellAlive(cell) {
  cell.status.current = GAME.ALIVE;
}
function setCellDead(cell) {
  cell.status.current = GAME.DEAD;
}
// FOR TESTING PURPOSES
export const game = {
  CONFIG: GAME,
  board,
  initializeBoard,
  loopGame,
  nextBoard,
  updateIteration
};
