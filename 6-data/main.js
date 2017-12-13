import { Board, Index } from "./data.js";
import { CANVAS, GAME, TEST } from "./config.js";
import { Test } from "./test.js";

let board = new Board(GAME.COLUMNS, GAME.ROWS);

start();
function start() {
  initialize();
  Test.initialize(board);
  mainGameLoop();
}

function initialize() {
  board.map(initializeCell);
}
function initializeCell(cell) {
  if (canBeAlive()) {
    setCellAlive(cell);
  } else {
    setCellDead(cell);
  }
  return cell;
}
function canBeAlive() {
  const LIFE_PROBABILITY = 0.44;
  const randomLifeProbability = Math.random();
  return randomLifeProbability > LIFE_PROBABILITY;
}
function mainGameLoop() {
  live();
  Test.live(TEST, board);
  if (keepTesting()) {
    setTimeout(mainGameLoop, TEST.DELAY_MS);
  }
}
function keepTesting() {
  const now = Date.now();
  const workedTime = now - TEST.INITIALIZATION_TIME;
  return workedTime < TEST.TIMING_TEST_MS;
}
function live() {
  calculateNewGeneration();
  drawBoardOnCanvas();
}
function calculateNewGeneration() {
  board.map(setLifeAroundCell);
  board.map(generateNextCell);
}
function setLifeAroundCell(cell) {
  cell.lifeAround = countLifeAround(cell);
  return cell;
}
function generateNextCell(cell) {
  if (cellIsDead(cell)) {
    generateForDeadCell(cell);
  } else {
    generateForAliveCell(cell);
  }
  return cell;
}
function cellIsDead(cell) {
  return cell.state == GAME.IS_DEAD;
}
function generateForDeadCell(cell) {
  if (cellMustBorn(cell.lifeAround)) {
    setCellAlive(cell);
  }
}
function generateForAliveCell(cell) {
  if (cellMustDie(cell.lifeAround)) {
    setCellDead(cell);
  } else {
    setCellAlive(cell);
  }
}
function setCellDead(cell) {
  cell.state = GAME.IS_DEAD;
}
function setCellAlive(cell) {
  cell.state = GAME.IS_ALIVE;
}
function cellMustBorn(lifeAround) {
  return lifeAround == GAME.REPRODUCTION;
}
function cellMustDie(lifeAround) {
  return isAlone(lifeAround) || isFull(lifeAround);
}
function isAlone(lifeAround) {
  return lifeAround < GAME.UNDER_POPULATION;
}
function isFull(lifeAround) {
  return lifeAround > GAME.OVER_POPULATION;
}

function drawBoardOnCanvas() {
  const CANVAS_ID = "gameCanvas";
  const canvas = document.getElementById(CANVAS_ID);
  const context = setUpCanvasContext(canvas);
  fillCanvasContext(context);
}
function setUpCanvasContext(canvas) {
  setSizeOfCanvas(canvas);
  return getCanvasClearContext(canvas);
}
function setSizeOfCanvas(canvas) {
  canvas.width = GAME.COLUMNS * CANVAS.CELL_SQUARE_PXS;
  canvas.height = GAME.ROWS * CANVAS.CELL_SQUARE_PXS;
  canvas.style.width = canvas.width;
  canvas.style.height = canvas.height;
}
function getCanvasClearContext(canvas) {
  const context = canvas.getContext("2d");
  context.fillStyle = CANVAS.DEAD_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return context;
}
function fillCanvasContext(context) {
  for (let column = 0; column < GAME.COLUMNS; column++) {
    for (let row = 0; row < GAME.ROWS; row++) {
      fillCell(context, column, row);
    }
  }
}
function fillCell(context, column, row) {
  if (cellIsAlive(column, row)) {
    fillCellAlive(context, column, row);
  }
}
function fillCellAlive(context, column, row) {
  context.fillStyle = CANVAS.ALIVE_COLOR;
  context.fillRect(
    column * CANVAS.CELL_SQUARE_PXS,
    row * CANVAS.CELL_SQUARE_PXS,
    CANVAS.CELL_SQUARE_PXS,
    CANVAS.CELL_SQUARE_PXS
  );
}
function countLifeAround(cell) {
  let liveAround = 0;
  const cellColumn = cell.index.column;
  const cellRow = cell.index.row;
  const leftColumn = cellColumn - 1;
  const rightColumn = cellColumn + 1;
  const topRow = cellRow - 1;
  const bottomRow = cellRow + 1;
  liveAround += countIfAlive(leftColumn, topRow);
  liveAround += countIfAlive(leftColumn, cellRow);
  liveAround += countIfAlive(leftColumn, bottomRow);
  liveAround += countIfAlive(cellColumn, topRow);
  liveAround += countIfAlive(cellColumn, bottomRow);
  liveAround += countIfAlive(rightColumn, topRow);
  liveAround += countIfAlive(rightColumn, cellRow);
  liveAround += countIfAlive(rightColumn, bottomRow);
  return liveAround;
}
function countIfAlive(column, row) {
  return cellIsInBoard(column, row) && cellIsAlive(column, row);
}
function cellIsInBoard(column, row) {
  return columnIsInBoard(column) && rowIsInBoard(row);
}
function columnIsInBoard(column) {
  return column >= 0 && column < GAME.COLUMNS;
}
function rowIsInBoard(row) {
  return row >= 0 && row < GAME.ROWS;
}
function cellIsAlive(column, row) {
  const index = new Index(column, row);
  return board.getItem(index).state == GAME.IS_ALIVE;
}
