const BOARD_COLUMNS = 140;
const BOARD_ROWS = 70;
const LIFE_PROBABILITY = 0.44;
const IS_DEAD = 0;
const IS_ALIVE = 1;
const REPRODUCTION_POPULATION = 3;
const UNDER_POPULATION = 2;
const OVER_POPULATION = 3;
const DELAY_MS = 50;
const TIMING_TEST_MS = 5000;
var initializationTime = Date.now();
var testIterations = 0;
var board = [];
var nextBoard = [];

start();
function start() {
  console.clear();
  console.log("Begin tests...");
  initialize();
  testInitialization();
  mainGameLoop();
}

function initialize() {
  // create default board array
  // sudo random noise
  for (var column = 0; column < BOARD_COLUMNS; column++) {
    board[column] = [];
    nextBoard[column] = [];
    for (var row = 0; row < BOARD_ROWS; row++) {
      board[column][row] = IS_DEAD;
      nextBoard[column][row] = IS_DEAD;
      var randomLifeProbability = Math.random();
      if (randomLifeProbability > LIFE_PROBABILITY) {
        board[column][row] = IS_ALIVE;
      }
    }
  }
}

function testInitialization() {
  console.group("Initialization");
  testBoardSize();
  console.log("board size ok");
  testNextBoardSize();
  console.log("nextBoard size ok");
  testBoardsContents();
  console.groupEnd();
  function testBoardSize() {
    console.assert(hasBegin(), `board has no begin`, board);
    console.assert(hasEnd(), `board has no end`, board);
    console.assert(isNotOversized(), `board is oversized`, board);
    function hasBegin() {
      return board[0][0] !== null;
    }
    function hasEnd() {
      const lastColumn = BOARD_COLUMNS - 1;
      const lastRow = BOARD_ROWS - 1;
      return board[lastColumn][lastRow] !== null;
    }
    function isNotOversized() {
      return (
        board[BOARD_COLUMNS] == undefined && board[0][BOARD_ROWS] == undefined
      );
    }
  }
  function testNextBoardSize() {
    console.assert(hasBegin(), `next board has no begin`, nextBoard);
    console.assert(hasEnd(), `next board has no end`, nextBoard);
    console.assert(isNotOversized(), `next board is oversized`, nextBoard);
    function hasBegin() {
      return nextBoard[0][0] !== null;
    }
    function hasEnd() {
      const lastColumn = BOARD_COLUMNS - 1;
      const lastRow = BOARD_ROWS - 1;
      return nextBoard[lastColumn][lastRow] !== null;
    }
    function isNotOversized() {
      return (
        nextBoard[BOARD_COLUMNS] === undefined &&
        nextBoard[0][BOARD_ROWS] === undefined
      );
    }
  }
  function testBoardsContents() {
    board.forEach(column => {
      column.forEach(row => {
        console.assert(isCellValueOK(row), `board has invalid data`, row);
      });
    });
    console.log("board contents ok");
    nextBoard.forEach(column => {
      column.forEach(row => {
        console.assert(isCellValueOK(row), `board has invalid data`, row);
      });
    });
    console.log("nextBoard contents ok");
    function isCellValueOK(value) {
      return value === IS_ALIVE || value === IS_DEAD;
    }
  }
}

function mainGameLoop() {
  var now = Date.now();
  updateIteration();
  testUpdateIterations();
  if (now - initializationTime > TIMING_TEST_MS) {
    console.log("Test end!!!");
    return;
  }
  setTimeout(mainGameLoop, DELAY_MS);
}

function updateIteration() {
  newGeneration();
  function newGeneration() {
    for (var column = 0; column < BOARD_COLUMNS; column++) {
      for (var row = 0; row < BOARD_ROWS; row++) {
        var livingNeighbors = countLivingNeighbors(column, row);
        if (board[column][row] == IS_DEAD) {
          if (livingNeighbors == REPRODUCTION_POPULATION) {
            nextBoard[column][row] = IS_ALIVE;
          }
        } else {
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
    }
    board = nextBoard;
  }
  drawBoardOnCanvas();
  function drawBoardOnCanvas() {
    const DEAD_COLOR = "#fee";
    const ALIVE_COLOR = "#ee66aa";
    const CELL_SQUARE_PIXELS = 10;
    const CANVAS_ID = "gameCanvas";
    const CONTEXT_DIMENSIONS = "2d";
    const boardCanvas = document.getElementById(CANVAS_ID);
    const canvasContext = boardCanvas.getContext(CONTEXT_DIMENSIONS);
    // setup canvas
    boardCanvas.width = BOARD_COLUMNS * CELL_SQUARE_PIXELS;
    boardCanvas.height = BOARD_ROWS * CELL_SQUARE_PIXELS;
    boardCanvas.style.width = boardCanvas.width;
    boardCanvas.style.height = boardCanvas.height;
    // clear canvas
    canvasContext.fillStyle = DEAD_COLOR;
    canvasContext.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
    for (let column = 0; column < BOARD_COLUMNS; column++) {
      for (let row = 0; row < BOARD_ROWS; row++) {
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
    if (column > 0 && column < BOARD_COLUMNS && row > 0 && row < BOARD_ROWS) {
      if (board[column][row] == IS_ALIVE) livingNeighbors++;
    }
  }
  return livingNeighbors;
}

function testUpdateIterations() {
  testIterations++;
  console.group(`update iteration executed ${testIterations} times`);
  testGoLRules();
  function testGoLRules() {
    for (let column = 0; column < BOARD_COLUMNS; column++) {
      for (let row = 0; row < BOARD_ROWS; row++) {
        const currentStatus = board[column][row];
        const nextStatus = nextBoard[column][row];
        testTransitionOk(currentStatus, nextStatus, column, row);
      }
    }
    console.log("GoL rules ok");
    function testTransitionOk(currentStatus, nextStatus, column, row) {
      const livingNeighbors = countLivingNeighbors(column, row);
      const transition = {
        currentStatus,
        nextStatus,
        column,
        row,
        livingNeighbors
      };
      if (currentStatus == IS_ALIVE) {
        if (nextStatus == IS_ALIVE) {
          console.assert(true || livingNeighbors <= OVER_POPULATION, {
            message: "Transition incorrect wasOkToKeepAlive",
            transition
          });
        } else {
          console.assert(
            livingNeighbors < UNDER_POPULATION ||
              livingNeighbors > OVER_POPULATION,
            {
              message: "Transition incorrect diesByUnderOROverPopulation",
              transition
            }
          );
        }
      } else {
        if (nextStatus == IS_ALIVE) {
          console.assert(livingNeighbors === REPRODUCTION_POPULATION, {
            message: "Transition incorrect isNewBorn",
            transition
          });
        } else {
          console.assert(true || livingNeighbors < REPRODUCTION_POPULATION, {
            message: "Transition incorrect notEnoughToBorn",
            transition
          });
        }
      }
    }
  }
  console.groupEnd();
}
