import { Board, Index } from "./data.js";
import { CanvasConfig, Config, TestConfig } from "./config.js";
import { Test } from "./test.js";

let config = new Config();
let canvasConfig = new CanvasConfig();
let testConfig = new TestConfig();
let board = new Board(config.COLUMNS, config.ROWS);

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
  Test.live(testConfig, board);
  if (keepTesting()) {
    setTimeout(mainGameLoop, testConfig.DELAY_MS);
  }
}
function keepTesting() {
  var now = Date.now();
  var workedTime = now - testConfig.INITIALIZATION_TIME;
  return workedTime < testConfig.TIMING_TEST_MS;
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
  return cell.state == config.IS_DEAD;
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
  cell.state = config.IS_DEAD;
}
function setCellAlive(cell) {
  cell.state = config.IS_ALIVE;
}
function cellMustBorn(lifeAround) {
  return lifeAround == config.REPRODUCTION;
}
function cellMustDie(lifeAround) {
  return isAlone(lifeAround) || isFull(lifeAround);
}
function isAlone(lifeAround) {
  return lifeAround < config.UNDER_POPULATION;
}
function isFull(lifeAround) {
  return lifeAround > config.OVER_POPULATION;
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
  canvas.width = config.COLUMNS * canvasConfig.CELL_SQUARE_PXS;
  canvas.height = config.ROWS * canvasConfig.CELL_SQUARE_PXS;
  canvas.style.width = canvas.width;
  canvas.style.height = canvas.height;
}
function getCanvasClearContext(canvas) {
  const context = canvas.getContext("2d");
  context.fillStyle = canvasConfig.DEAD_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return context;
}
function fillCanvasContext(context) {
  for (var column = 0; column < config.COLUMNS; column++) {
    for (var row = 0; row < config.ROWS; row++) {
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
  context.fillStyle = canvasConfig.ALIVE_COLOR;
  context.fillRect(
    column * canvasConfig.CELL_SQUARE_PXS,
    row * canvasConfig.CELL_SQUARE_PXS,
    canvasConfig.CELL_SQUARE_PXS,
    canvasConfig.CELL_SQUARE_PXS
  );
}
function countLifeAround(cell) {
  var liveAround = 0;
  var cellColumn = cell.index.column;
  var cellRow = cell.index.row;
  var leftColumn = cellColumn - 1;
  var rightColumn = cellColumn + 1;
  var topRow = cellRow - 1;
  var bottomRow = cellRow + 1;
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
  return column >= 0 && column < config.COLUMNS;
}
function rowIsInBoard(row) {
  return row >= 0 && row < config.ROWS;
}
function cellIsAlive(column, row) {
  const index = new Index(column, row);
  return board.getItem(index).state == config.IS_ALIVE;
}
