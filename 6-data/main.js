import { CANVAS } from "./config/canvas.js";
import { GAME } from "./config/game.js";
import { Board } from "./database/board.js";
import { Index } from "./database/index.js";
const initializationTime = Date.now();
const board = new Board(GAME.BOARD_COLUMNS, GAME.BOARD_ROWS);
const boardCanvas = document.getElementById(CANVAS.ELEMEMT_ID);
const canvasContext = boardCanvas.getContext(CANVAS.CONTEXT);

function start() {
  initializeBoard();
  loopGame();
}
function initializeBoard() {
  this.board.forEach(initializeCell);
}
function initializeCell(cell) {
  if (canBorn()) {
    setCellAlive(cell);
  } else {
    setCellDead(cell);
  }
  updateStatus(cell);
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
  board.forEach(generateNextCellState);
  board.forEach(updateStatus);
}
function generateNextCellState(cell, index, board) {
  countLifeAround(cell, index, board);
  if (isCellDead(cell)) {
    generateFromDeadCell(cell);
  } else {
    generateFromLivingCell(cell);
  }
}
function updateStatus(cell) {
  cell.status.former = cell.status.current;
  cell.status.current = cell.status.next;
  cell.status.generation++;
}
function countLifeAround(cell, index, board) {
  const previous = -1;
  const next = 2;
  cell.lifeAround = 0;
  for (let xStep = previous; xStep < next; xStep++) {
    for (let yStep = previous; yStep < next; yStep++) {
      const neighborIndex = new Index(
        index.column + xStep,
        index.row + yStep
      );
      cell.lifeAround += countIfNeighborIsAlive(
        neighborIndex,
        board
      );
    }
  }
  if (isCellAlive(cell)) {
    deductItself(cell);
  }
}
function deductItself(cell) {
  cell.lifeAround--;
}
function countIfNeighborIsAlive(neighborIndex, board) {
  if (board.isOnBoard(neighborIndex)) {
    const neighbor = board.getItem(neighborIndex);
    if (isCellAlive(neighbor)) {
      return GAME.ALIVE;
    }
  }
  return GAME.DEAD;
}
function generateFromDeadCell(cell) {
  if (mustBorn(cell)) {
    setCellAlive(cell);
  } else {
    setCellDead(cell);
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
  return cell.lifeAround == GAME.REPRODUCTION_POPULATION;
}
function mustDie(cell) {
  return (
    cell.lifeAround < GAME.UNDER_POPULATION ||
    cell.lifeAround > GAME.OVER_POPULATION
  );
}
function drawBoardOnCanvas(board) {
  setUpCanvas();
  board.forEach(fillCell);
}
function setUpCanvas() {
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
    CANVAS.INIT_WIDTH,
    CANVAS.INIT_HEIGHT,
    boardCanvas.width,
    boardCanvas.height
  );
}
function fillCell(cell, index) {
  if (isCellAlive(cell)) {
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
function isCellAlive(cell) {
  return cell.status.current === GAME.ALIVE;
}
function isCellDead(cell) {
  return cell.status.current === GAME.DEAD;
}
function setCellAlive(cell) {
  cell.status.next = GAME.ALIVE;
}
function setCellDead(cell) {
  cell.status.next = GAME.DEAD;
}
// FOR TESTING PURPOSES
export const game = {
  CONFIG: GAME,
  board,
  initializeBoard,
  loopGame,
  updateIteration
};
