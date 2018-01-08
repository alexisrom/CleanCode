const BOARD_COLUMNS = 140;
const BOARD_ROWS = 70;
const DELAY_MS = 50;
const IS_ALIVE = 1;
const IS_DEAD = 0;
const LIFE_PROBABILITY = 0.44;
const OVER_POPULATION = 3;
const REPRODUCTION_POPULATION = 3;
const TIMING_TEST_MS = 5000;
const UNDER_POPULATION = 2;
var board = [];
var initializationTime = Date.now();
var nextBoard = [];
var testIterations = 0;

start();
function start() {
  console.clear();
  console.log("Begin tests...");
  initialize();
  testInitialization();
  mainGameLoop();
}

function initialize() {
  for (var column = 0; column < BOARD_COLUMNS; column++) {
    initializeColumn(column);
  }
  function initializeColumn(column) {
    board[column] = [];
    nextBoard[column] = [];
    for (var row = 0; row < BOARD_ROWS; row++) {
      initializeColumnRow(column, row);
    }
  }
  function initializeColumnRow(column, row) {
    board[column][row] = IS_DEAD;
    nextBoard[column][row] = IS_DEAD;
    var randomLifeProbability = Math.random();
    if (randomLifeProbability > LIFE_PROBABILITY) {
      board[column][row] = IS_ALIVE;
    }
  }
}

function testInitialization() {
  console.clear();
  console.log("Begin tests...");
  console.group("Initialization");
  testBoardSize();
  function testBoardSize() {
    console.assert(hasBegin(), `board has no begin`, board);
    console.assert(hasEnd(), `board has no end`, board);
    console.assert(isNotOversized(), `board is oversized`, board);
    function hasBegin() {
      return board[0][0] !== null;
    }
    function hasEnd() {
      const LAST_COLUMN = BOARD_COLUMNS - 1;
      const LAST_ROW = BOARD_ROWS - 1;
      return board[LAST_COLUMN][LAST_ROW] !== null;
    }
    function isNotOversized() {
      return (
        board[BOARD_COLUMNS] == undefined && board[0][BOARD_ROWS] == undefined
      );
    }
  }
  console.log("board size ok");
  testNextBoardSize();
  function testNextBoardSize() {
    console.assert(hasBegin(), `next board has no begin`, nextBoard);
    console.assert(hasEnd(), `next board has no end`, nextBoard);
    console.assert(isNotOversized(), `next board is oversized`, nextBoard);
    function hasBegin() {
      return nextBoard[0][0] !== null;
    }
    function hasEnd() {
      const LAST_COLUMN = BOARD_COLUMNS - 1;
      const LAST_ROW = BOARD_ROWS - 1;
      return nextBoard[LAST_COLUMN][LAST_ROW] !== null;
    }
    function isNotOversized() {
      return (
        nextBoard[BOARD_COLUMNS] === undefined &&
        nextBoard[0][BOARD_ROWS] === undefined
      );
    }
  }
  console.log("nextBoard size ok");
  testBoardsContents();
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
  console.groupEnd();
}

function mainGameLoop() {
  updateIteration();
  testUpdateIterations();
  console.groupEnd();
  stopOrKeepTesting();
  function stopOrKeepTesting() {
    var now = Date.now();
    if (now - initializationTime < TIMING_TEST_MS) {
      setTimeout(mainGameLoop, DELAY_MS);
    } else {
      console.log("Test end!!!");
    }
  }
}

function updateIteration() {
  newGeneration();
  function newGeneration() {
    for (var column = 0; column < BOARD_COLUMNS; column++) {
      for (var row = 0; row < BOARD_ROWS; row++) {
        generateForCell(column, row);
      }
    }
    board = nextBoard;
    function generateForCell(column, row) {
      var livingNeighbors = countLivingNeighbors(column, row);
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
  }
  drawBoardOnCanvas();
  function drawBoardOnCanvas() {
    // setup canvas
    const DEAD_COLOR = "#fee";
    const ALIVE_COLOR = "#ee66aa";
    var boardCanvas = document.getElementById("gameCanvas");
    var canvasContext = boardCanvas.getContext("2d");
    const CELL_SQUARE_PIXELS = 10;

    boardCanvas.width = BOARD_COLUMNS * CELL_SQUARE_PIXELS;
    boardCanvas.height = BOARD_ROWS * CELL_SQUARE_PIXELS;
    boardCanvas.style.width = boardCanvas.width;
    boardCanvas.style.height = boardCanvas.height;
    // clear canvas
    canvasContext.fillStyle = DEAD_COLOR;
    canvasContext.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
    for (var column = 0; column < BOARD_COLUMNS; column++) {
      for (var row = 0; row < BOARD_ROWS; row++) {
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
}

function testUpdateIterations() {
  updateIteration();
  testIterations++;
  console.group(`update iteration executed ${testIterations} times`);
  testGoLRules();
  function testGoLRules() {
    for (var column = 0; column < BOARD_COLUMNS; column++) {
      for (var row = 0; row < BOARD_ROWS; row++) {
        testColumnRow(column, row);
      }
    }
    function testColumnRow(column, row) {
      var currentStatus = board[column][row];
      var nextStatus = nextBoard[column][row];
      testTransitionOk(currentStatus, nextStatus, column, row);
    }
    function testTransitionOk(currentStatus, nextStatus, column, row) {
      var livingNeighbors = countLivingNeighbors(column, row);
      var transition = {
        currentStatus,
        nextStatus,
        column,
        row,
        livingNeighbors
      };
      if (currentStatus == IS_ALIVE) {
        testTransitionForAliveCell();
      } else {
        testTransitionForDeadCell();
      }
      function testTransitionForAliveCell() {
        if (nextStatus == IS_ALIVE) {
          wasOkToKeepAlive();
        } else {
          wasOKtoDieByUnderOROverPopulation();
        }
        function wasOkToKeepAlive() {
          console.assert(true || livingNeighbors <= OVER_POPULATION, {
            message: "Transition incorrect wasOkToKeepAlive",
            transition
          });
        }
        function wasOKtoDieByUnderOROverPopulation() {
          console.assert(
            livingNeighbors < UNDER_POPULATION ||
              livingNeighbors > OVER_POPULATION,
            {
              message: "Transition incorrect diesByUnderOROverPopulation",
              transition
            }
          );
        }
      }
      function testTransitionForDeadCell() {
        if (nextStatus == IS_ALIVE) {
          wasOkToHaveBorn();
        } else {
          WasOkToNotBorn();
        }
        function wasOkToHaveBorn() {
          console.assert(livingNeighbors === REPRODUCTION_POPULATION, {
            message: "Transition incorrect isNewBorn",
            transition
          });
        }
        function WasOkToNotBorn() {
          console.assert(true || livingNeighbors < REPRODUCTION_POPULATION, {
            message: "Transition incorrect notEnoughToBorn",
            transition
          });
        }
      }
    }
    console.log("GoL rules ok");
  }
}

function countLivingNeighbors(column, row) {
  var livingNeighbors = 0;
  var leftColumn = column - 1;
  var rightColumn = column + 1;
  var topRow = row - 1;
  var bottomRow = row + 1;
  visitNeighbors();
  function visitNeighbors() {
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
  }
  return livingNeighbors;
}
