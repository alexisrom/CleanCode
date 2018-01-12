const BOARD_COLUMNS = 140;
const BOARD_ROWS = 70;
const DELAY_MS = 50;
const IS_ALIVE = 1;
const IS_DEAD = 0;
const LIFE_PROBABILITY = 0.44;
const OVER_POPULATION = 3;
const REPRODUCTION_POPULATION = 3;
const MINUTE_MS = 60 * 1000;
const LIVE_GAME_MS = MINUTE_MS;
const UNDER_POPULATION = 2;
const board = [];
const initializationTime = Date.now();
const nextBoard = [];

function start() {
  initializeBoard();
  mainGameLoop();
}
function initializeBoard() {
  for (let column = 0; column < BOARD_COLUMNS; column++) {
    initializeColumn(column);
  }
  function initializeColumn(column) {
    board[column] = [];
    nextBoard[column] = [];
    for (let row = 0; row < BOARD_ROWS; row++) {
      initializeColumnRow(column, row);
    }
  }
  function initializeColumnRow(column, row) {
    board[column][row] = IS_DEAD;
    nextBoard[column][row] = IS_DEAD;
    const randomLifeProbability = Math.random();
    if (randomLifeProbability > LIFE_PROBABILITY) {
      board[column][row] = IS_ALIVE;
    }
  }
}
function mainGameLoop() {
  updateIteration();
  drawBoardOnCanvas();
  stopOrKeepTesting();
  function stopOrKeepTesting() {
    const now = Date.now();
    if (now - initializationTime > LIVE_GAME_MS) {
      return;
    } else {
      setTimeout(mainGameLoop, DELAY_MS);
    }
  }
}
function updateIteration() {
  newGeneration();
  function newGeneration() {
    for (let column = 0; column < BOARD_COLUMNS; column++) {
      for (let row = 0; row < BOARD_ROWS; row++) {
        generateForCell(column, row);
      }
    }
    cloneBoard(board, nextBoard);
    function generateForCell(column, row) {
      const livingNeighbors = countLivingNeighbors(column, row);
      if (board[column][row] == IS_DEAD) {
        generateForDeadCell();
      } else {
        generateForAliveCell();
      }
      function generateForDeadCell() {
        if (livingNeighbors == REPRODUCTION_POPULATION) {
          nextBoard[column][row] = IS_ALIVE;
        }
      }
      function generateForAliveCell() {
        if (
          livingNeighbors < UNDER_POPULATION ||
          livingNeighbors > OVER_POPULATION
        ) {
          nextBoard[column][row] = IS_DEAD;
        } else {
          nextBoard[column][row] = IS_ALIVE;
        }
      }
    }
    function cloneBoard(clonedBoard, currentBoard) {
      for (let column = 0; column < BOARD_COLUMNS; column++) {
        for (let row = 0; row < BOARD_ROWS; row++) {
          clonedBoard[column][row] = currentBoard[column][row];
        }
      }
    }
  }
}
function drawBoardOnCanvas() {
  // setup canvas
  const DEAD_COLOR = "#a98600";
  const ALIVE_COLOR = "#f8ed62";
  const boardCanvas = document.getElementById("gameCanvas");
  const canvasContext = boardCanvas.getContext("2d");
  const CELL_SQUARE_PIXELS = 10;

  boardCanvas.width = BOARD_COLUMNS * CELL_SQUARE_PIXELS;
  boardCanvas.height = BOARD_ROWS * CELL_SQUARE_PIXELS;
  boardCanvas.style.width = boardCanvas.width;
  boardCanvas.style.height = boardCanvas.height;
  // clear canvas
  canvasContext.fillStyle = DEAD_COLOR;
  canvasContext.fillRect(
    0,
    0,
    boardCanvas.width,
    boardCanvas.height
  );
  for (let column = 0; column < BOARD_COLUMNS; column++) {
    for (let row = 0; row < BOARD_ROWS; row++) {
      fillCell(column, row);
    }
  }
  function fillCell(column, row) {
    if (board[column][row] == IS_ALIVE) {
      canvasContext.fillStyle = ALIVE_COLOR;
      canvasContext.fillRect(
        column * CELL_SQUARE_PIXELS,
        row * CELL_SQUARE_PIXELS,
        CELL_SQUARE_PIXELS,
        CELL_SQUARE_PIXELS
      );
    }
  }
}
function countLivingNeighbors(column, row) {
  let livingNeighbors = 0;
  const leftColumn = column - 1;
  const rightColumn = column + 1;
  const topRow = row - 1;
  const bottomRow = row + 1;
  countIfAlive(leftColumn, topRow);
  countIfAlive(leftColumn, row);
  countIfAlive(leftColumn, bottomRow);
  countIfAlive(column, topRow);
  countIfAlive(column, bottomRow);
  countIfAlive(rightColumn, topRow);
  countIfAlive(rightColumn, row);
  countIfAlive(rightColumn, bottomRow);
  function countIfAlive(column, row) {
    // if x and y on the board
    if (
      column >= 0 &&
      column < BOARD_COLUMNS &&
      row >= 0 &&
      row < BOARD_ROWS
    ) {
      if (board[column][row] == IS_ALIVE) livingNeighbors++;
    }
  }
  return livingNeighbors;
}

// FOR TESTING PURPOSES
export const game = {
  BOARD_COLUMNS,
  BOARD_ROWS,
  board,
  countLivingNeighbors,
  initializeBoard,
  mainGameLoop,
  nextBoard,
  updateIteration
};
