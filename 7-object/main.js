import { GAME } from "./config/game.js";
import { CANVAS } from "./config/canvas.js";
import { Game } from "./app/game.js";
import { Canvas } from "./app/canvas.js";
const initializationTime = Date.now();
const game = new Game();
const boardCanvas = document.getElementById("gameCanvas");
const canvasContext = boardCanvas.getContext("2d");

function start() {
  initializeBoard();
  loopGame();
}
function initializeBoard() {
  game.initializeBoard();
}
function updateIteration() {
  game.updateIteration();
}
function loopGame() {
  updateIteration();
  drawBoardOnCanvas(game.board);
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

function drawBoardOnCanvas(board) {
  setUpCanvas();
  board.forEach(fillCell);
}
function setUpCanvas() {
  const canvas = new Canvas();
  boardCanvas.width =
    GAME.BOARD_COLUMNS * CANVAS.CELL_SQUARE_PXS;
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
function fillCell(cell, index) {
  if (cell.status.current === GAME.ALIVE) {
    fillLivingCell(index.column, index.row);
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

// FOR TESTING PURPOSES
export const main = {
  CONFIG: GAME,
  board: game.board,
  initializeBoard,
  loopGame,
  updateIteration
};
