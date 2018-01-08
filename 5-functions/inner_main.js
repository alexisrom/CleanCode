const BIRTH_POPULATION = 3;
const BOARD_COLUMNS = 140;
const BOARD_ROWS = 70;
const DELAY_MS = 50;
const IS_ALIVE = 1;
const IS_DEAD = 0;
const OVER_POPULATION = 3;
const UNDER_POPULATION = 2;
let board = [];
let generationTests = 0;
let nextBoard = [];
let previousBoard = [];

start();
function start() {
  console.clear();
  const INITIALIZATION_TIME = Date.now();
  initializeBoard();
  testInitialization();
  mainGameLoop();
  function initializeBoard() {
    goThroughEachColumn();
    function goThroughEachColumn() {
      for (var column = 0; column < BOARD_COLUMNS; column++) {
        initializeColumn(column);
      }
      function initializeColumn(column) {
        board[column] = [];
        nextBoard[column] = [];
        for (var row = 0; row < BOARD_ROWS; row++) {
          initializeColumnRow(row);
        }
        function initializeColumnRow(row) {
          setInitialDead();
          setSomeoneAlive();
          function setInitialDead() {
            board[column][row] = IS_DEAD;
            nextBoard[column][row] = IS_DEAD;
          }
          function setSomeoneAlive() {
            if (canBeAlive()) {
              board[column][row] = IS_ALIVE;
            }
            function canBeAlive() {
              const LIFE_PROBABILITY = 0.44;
              const randomLifeProbability = Math.random();
              return randomLifeProbability > LIFE_PROBABILITY;
            }
          }
        }
      }
    }
  }
  function testInitialization() {
    console.group("Begin tests...");
    testBoardsSize();
    testBoardsContents();
    console.group("Initialization Ok");
    console.groupEnd();
    function testBoardsSize() {
      testBoardSize(board);
      console.log("board size ok");
      testBoardSize(nextBoard);
      console.log("nextBoard size ok");
      function testBoardSize(board) {
        console.assert(hasBegin(), `hasBegin`, board);
        console.assert(hasEnd(), `hasEnd`, board);
        console.assert(isNotLarger(), `isNotLarger`, board);
        function hasBegin() {
          return board[0][0] !== null;
        }
        function hasEnd() {
          const LAST_COLUMN = BOARD_COLUMNS - 1;
          const LAST_ROW = BOARD_ROWS - 1;
          return board[LAST_COLUMN][LAST_ROW] !== null;
        }
        function isNotLarger() {
          return noExtraColumn() && noExtraRow();
          function noExtraColumn() {
            return board[BOARD_COLUMNS] == undefined;
          }
          function noExtraRow() {
            return board[0][BOARD_ROWS] == undefined;
          }
        }
      }
    }
    function testBoardsContents() {
      goThroughEachCell(board);
      console.log("board contents ok");
      goThroughEachCell(nextBoard);
      console.log("nextBoard contents ok");
      function goThroughEachCell(board) {
        board.forEach(column => {
          column.forEach(row => {
            console.assert(isCellOK(row), `isCellOK`, row);
          });
        });
        function isCellOK(cell) {
          return cell === IS_ALIVE || cell === IS_DEAD;
        }
      }
    }
  }
  function mainGameLoop() {
    iterateGeneration();
    testUpdateIterations();
    stopOrKeepTesting();
    function iterateGeneration() {
      calculateNewGeneration();
      drawBoardOnCanvas();
      function calculateNewGeneration() {
        goThroughEachCell();
        setBoardWithNextStates();
        function goThroughEachCell() {
          for (var column = 0; column < BOARD_COLUMNS; column++) {
            for (var row = 0; row < BOARD_ROWS; row++) {
              generateNextCell(column, row);
            }
          }
          function generateNextCell(column, row) {
            const cell = { board, column, row };
            const liveAround = countLiveAround(cell);
            if (cellIsDead()) {
              generateForDeadCell();
            } else {
              generateForAliveCell();
            }
            function cellIsDead() {
              return board[column][row] == IS_DEAD;
            }
            function generateForDeadCell() {
              if (cellMustBorn()) {
                setNextCellAlive();
              }
              function cellMustBorn() {
                return liveAround == BIRTH_POPULATION;
              }
            }
            function generateForAliveCell() {
              if (cellMustDie()) {
                setNextCellDead();
              } else {
                setNextCellAlive();
              }
              function cellMustDie() {
                return (
                  liveAround < UNDER_POPULATION || liveAround > OVER_POPULATION
                );
              }
            }
            function setNextCellAlive() {
              nextBoard[column][row] = IS_ALIVE;
            }
            function setNextCellDead() {
              nextBoard[column][row] = IS_DEAD;
            }
          }
        }
        function setBoardWithNextStates() {
          previousBoard = board;
          board = nextBoard;
        }
      }
      function drawBoardOnCanvas() {
        const DEAD_COLOR = "#eee";
        const ALIVE_COLOR = "#0080ff";
        const CELL_SQUARE_PIXELS = 10;
        const CANVAS_ID = "gameCanvas";
        const canvas = document.getElementById(CANVAS_ID);
        const context = canvas.getContext("2d");
        setUpCanvas();
        fillCanvas();
        function setUpCanvas() {
          setSizeOfCanvas();
          clearCanvas();
          function setSizeOfCanvas() {
            canvas.width = BOARD_COLUMNS * CELL_SQUARE_PIXELS;
            canvas.height = BOARD_ROWS * CELL_SQUARE_PIXELS;
            canvas.style.width = canvas.width;
            canvas.style.height = canvas.height;
          }
          function clearCanvas() {
            context.fillStyle = DEAD_COLOR;
            context.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
        function fillCanvas() {
          for (var column = 0; column < BOARD_COLUMNS; column++) {
            for (var row = 0; row < BOARD_ROWS; row++) {
              fillCell(column, row);
            }
          }
          function fillCell(column, row) {
            if (cellIsAlive()) {
              fillCellAlive();
            }
            function cellIsAlive() {
              return board[column][row] == IS_ALIVE;
            }
            function fillCellAlive() {
              context.fillStyle = ALIVE_COLOR;
              context.fillRect(
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
    function testUpdateIterations() {
      generationTests++;
      testGoLRules();
      function testGoLRules() {
        console.group(`iterate generation ${generationTests}`);
        for (var column = 0; column < BOARD_COLUMNS; column++) {
          for (var row = 0; row < BOARD_ROWS; row++) {
            testIfTransitionWasOkForCell(column, row);
          }
        }
        console.log("Test GoL rules end");
        console.groupEnd();
        function testIfTransitionWasOkForCell(column, row) {
          var previousStatus = previousBoard[column][row];
          var currentStatus = board[column][row];
          var liveAround = countLiveAround(previousBoard, column, row);
          var transition = {
            previousStatus,
            currentStatus,
            column,
            row,
            liveAround
          };
          if (previousStatus == IS_ALIVE) {
            testTransitionFromAliveCell();
          } else {
            testTransitionFromDeadCell();
          }
          function testTransitionFromAliveCell() {
            if (currentStatus == IS_ALIVE) {
              testIfWasOkToKeepAlive();
            } else {
              testIfWasOKtoDieByWrongPopulation();
            }
            function testIfWasOkToKeepAlive() {
              console.assert(is1G() || liveAround <= OVER_POPULATION, {
                message: "wasOkToKeepAlive",
                transition
              });
            }
            function testIfWasOKtoDieByWrongPopulation() {
              console.assert(
                liveAround < UNDER_POPULATION || liveAround > OVER_POPULATION,
                {
                  message: "wasOKtoDieByWrongPopulation",
                  transition
                }
              );
            }
          }
          function testTransitionFromDeadCell() {
            if (currentStatus == IS_ALIVE) {
              testIfWasOkToHaveBorn();
            } else {
              testIfWasOkToNotBorn();
            }
            function testIfWasOkToHaveBorn() {
              console.assert(is1G() || liveAround === BIRTH_POPULATION, {
                message: "wasOkToHaveBorn",
                transition
              });
            }
            function testIfWasOkToNotBorn() {
              console.assert(is1G() || liveAround < BIRTH_POPULATION, {
                message: "wasOkToNotBorn",
                transition
              });
            }
          }
          function is1G() {
            return generationTests == 1;
          }
        }
      }
    }
    function stopOrKeepTesting() {
      if (keepTesting()) {
        setTimeout(mainGameLoop, DELAY_MS);
      } else {
        console.log("Test end!!!");
        console.groupEnd();
      }
      function keepTesting() {
        const TIMING_TEST_MS = 5000;
        var now = Date.now();
        var workedTime = now - INITIALIZATION_TIME;
        return workedTime < TIMING_TEST_MS;
      }
    }
  }

  function countLiveAround(cell) {
    let liveAround = 0;
    const leftColumn = cell.column - 1;
    const rightColumn = cell.column + 1;
    const topRow = cell.row - 1;
    const bottomRow = cell.row + 1;
    countIfAlive(leftColumn, topRow);
    countIfAlive(leftColumn, cell.row);
    countIfAlive(leftColumn, bottomRow);
    countIfAlive(cell.column, topRow);
    countIfAlive(cell.column, bottomRow);
    countIfAlive(rightColumn, topRow);
    countIfAlive(rightColumn, cell.row);
    countIfAlive(rightColumn, bottomRow);
    function countIfAlive(column, row) {
      if (cellIsInBoard() && cellIsAlive()) {
        liveAround++;
      }
      function cellIsInBoard() {
        return columnIsInBoard() && rowIsInBoard();
        function columnIsInBoard() {
          return column >= 0 && column < BOARD_COLUMNS;
        }
        function rowIsInBoard() {
          return row >= 0 && row < BOARD_ROWS;
        }
      }
      function cellIsAlive() {
        return board[column][row] == IS_ALIVE;
      }
    }
    return liveAround;
  }
}
