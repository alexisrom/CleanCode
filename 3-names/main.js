const BOARD_COLUMNS = 140;
const BOARD_ROWS = 70;
const INIT_COLUMN = 0;
const INIT_ROW = 0;
const DELAY_MS = 50;
const ALIVE = 1;
const DEAD = 0;
const LIFE_PROBABILITY = 0.44;
const OVER_POPULATION = 3;
const REPRODUCTION_POPULATION = 3;
const MINUTE_MS = 60 * 1000;
const LIVE_GAME_MS = MINUTE_MS;
const UNDER_POPULATION = 2;
const board = [];
const initializationTime = Date.now();
const nextStateBoard = [];

function start() {
  initializeBoard();
  loopGame();
}
function initializeBoard() {
  // create default board array
  // sudo random noise
  for (
    let column = INIT_COLUMN;
    column < BOARD_COLUMNS;
    column++
  ) {
    board[column] = [];
    nextStateBoard[column] = [];
    for (let row = INIT_ROW; row < BOARD_ROWS; row++) {
      board[column][row] = DEAD;
      nextStateBoard[column][row] = DEAD;
      const randomLifeProbability = Math.random();
      if (randomLifeProbability > LIFE_PROBABILITY) {
        board[column][row] = ALIVE;
      }
    }
  }
}
function loopGame() {
  const now = Date.now();
  updateIteration();
  drawBoardOnCanvas();
  if (now - initializationTime > LIVE_GAME_MS) {
    return;
  }
  setTimeout(loopGame, DELAY_MS);
}
function updateIteration() {
  generateNextCellState();
  function generateNextCellState() {
    for (
      let column = INIT_COLUMN;
      column < BOARD_COLUMNS;
      column++
    ) {
      for (let row = INIT_ROW; row < BOARD_ROWS; row++) {
        const lifeAround = countLifeAround(column, row);
        if (board[column][row] == DEAD) {
          if (lifeAround == REPRODUCTION_POPULATION) {
            nextStateBoard[column][row] = ALIVE;
          } else {
            nextStateBoard[column][row] = DEAD;
          }
        } else {
          if (
            lifeAround < UNDER_POPULATION ||
            lifeAround > OVER_POPULATION
          ) {
            nextStateBoard[column][row] = DEAD;
          } else {
            nextStateBoard[column][row] = ALIVE;
          }
        }
      }
    }
    cloneToCurrentBoard(board, nextStateBoard);
  }
  function cloneToCurrentBoard(target, source) {
    for (
      let column = INIT_COLUMN;
      column < BOARD_COLUMNS;
      column++
    ) {
      for (let row = INIT_ROW; row < BOARD_ROWS; row++) {
        target[column][row] = source[column][row];
      }
    }
  }
}
function drawBoardOnCanvas() {
  const ALIVE_COLOR = "#ff7f00";
  const CELL_SQUARE_PIXELS = 10;
  const DEAD_COLOR = "#ffc898";
  const INIT_WIDTH = 0;
  const INIT_HEIGHT = 0;
  const boardCanvas = document.getElementById("gameCanvas");
  const canvasContext = boardCanvas.getContext("2d");
  // setup canvas
  boardCanvas.width = BOARD_COLUMNS * CELL_SQUARE_PIXELS;
  boardCanvas.height = BOARD_ROWS * CELL_SQUARE_PIXELS;
  boardCanvas.style.width = boardCanvas.width;
  boardCanvas.style.height = boardCanvas.height;
  // clear canvas
  canvasContext.fillStyle = DEAD_COLOR;
  canvasContext.fillRect(
    INIT_WIDTH,
    INIT_HEIGHT,
    boardCanvas.width,
    boardCanvas.height
  );
  for (
    let column = INIT_COLUMN;
    column < BOARD_COLUMNS;
    column++
  ) {
    for (let row = INIT_ROW; row < BOARD_ROWS; row++) {
      if (board[column][row] == ALIVE) {
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
}
function countLifeAround(column, row) {
  let lifeAround = 0;
  const STEP = 1;
  const leftColumn = column - STEP;
  const rightColumn = column + STEP;
  const topRow = row - STEP;
  const bottomRow = row + STEP;
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
      column >= INIT_COLUMN &&
      column < BOARD_COLUMNS &&
      row >= INIT_ROW &&
      row < BOARD_ROWS
    ) {
      if (board[column][row] == ALIVE) lifeAround++;
    }
  }
  return lifeAround;
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
  nextStateBoard,
  OVER_POPULATION,
  REPRODUCTION_POPULATION,
  UNDER_POPULATION,
  updateIteration
};
