const BOARD_COLUMNS = 140;
const BOARD_ROWS = 70;
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
const nextBoard = [];

function start() {
  initializeBoard();
  loopGame();
}
function initializeBoard() {
  // create default board array
  // sudo random noise
  for (let column = 0; column < BOARD_COLUMNS; column++) {
    board[column] = [];
    nextBoard[column] = [];
    for (let row = 0; row < BOARD_ROWS; row++) {
      board[column][row] = DEAD;
      nextBoard[column][row] = DEAD;
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
  setNewGeneration();
  function setNewGeneration() {
    for (let column = 0; column < BOARD_COLUMNS; column++) {
      for (let row = 0; row < BOARD_ROWS; row++) {
        const livingNeighbors = countLivingNeighbors(
          column,
          row
        );
        if (board[column][row] == DEAD) {
          if (livingNeighbors == REPRODUCTION_POPULATION) {
            nextBoard[column][row] = ALIVE;
          } else {
            nextBoard[column][row] = DEAD;
          }
        } else {
          if (
            livingNeighbors < UNDER_POPULATION ||
            livingNeighbors > OVER_POPULATION
          ) {
            nextBoard[column][row] = DEAD;
          } else {
            nextBoard[column][row] = ALIVE;
          }
        }
      }
    }
    cloneBoard(board, nextBoard);
  }
  function cloneBoard(clonedBoard, currentBoard) {
    for (let column = 0; column < BOARD_COLUMNS; column++) {
      for (let row = 0; row < BOARD_ROWS; row++) {
        clonedBoard[column][row] = currentBoard[column][row];
      }
    }
  }
}
function drawBoardOnCanvas() {
  const ALIVE_COLOR = "#ff7f00";
  const CANVAS_ID = "gameCanvas";
  const CELL_SQUARE_PIXELS = 10;
  const CONTEXT_DIMENSIONS = "2d";
  const DEAD_COLOR = "#ffc898";
  const boardCanvas = document.getElementById(CANVAS_ID);
  const canvasContext = boardCanvas.getContext(
    CONTEXT_DIMENSIONS
  );
  // setup canvas
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
      if (board[column][row] == ALIVE) livingNeighbors++;
    }
  }
  return livingNeighbors;
}

// FOR TESTING PURPOSES
export const game = {
  ALIVE,
  BOARD_COLUMNS,
  BOARD_ROWS,
  board,
  countLivingNeighbors,
  DEAD,
  initializeBoard,
  loopGame,
  nextBoard,
  OVER_POPULATION,
  REPRODUCTION_POPULATION,
  UNDER_POPULATION,
  updateIteration,
};
