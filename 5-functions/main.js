const ALIVE_COLOR = "#0080ff";
const BIRTH_POPULATION = 3;
const BOARD_COLUMNS = 140;
const BOARD_ROWS = 70;
const CELL_SQUARE_PIXELS = 10;
const DEAD_COLOR = "#eee";
const DELAY_MS = 50;
const INITIALIZATION_TIME = Date.now();
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
  initializeBoard();
  console.clear();
  console.group("Begin tests...");
  testInitialization();
  mainGameLoop();
}
function initializeBoard() {
  for (var column = 0; column < BOARD_COLUMNS; column++) {
    initializeColumn(column);
  }
}
function initializeColumn(column) {
  board[column] = [];
  nextBoard[column] = [];
  for (var row = 0; row < BOARD_ROWS; row++) {
    initializeColumnRow(column, row);
  }
}
function initializeColumnRow(column, row) {
  setInitialDead(column, row);
  setSomeoneAlive(column, row);
}
function setInitialDead(column, row) {
  board[column][row] = IS_DEAD;
  nextBoard[column][row] = IS_DEAD;
}
function setSomeoneAlive(column, row) {
  if (canBeAlive()) {
    setCellAlive(column, row);
  }
}
function setCellAlive(column, row) {
  board[column][row] = IS_ALIVE;
}
function canBeAlive() {
  const LIFE_PROBABILITY = 0.44;
  const randomLifeProbability = Math.random();
  return randomLifeProbability > LIFE_PROBABILITY;
}
function mainGameLoop() {
  iterateGeneration();
  testUpdateIterations();
  stopOrKeepTesting();
}
function iterateGeneration() {
  calculateNewGeneration();
  drawBoardOnCanvas();
}
function calculateNewGeneration() {
  generateNextForEachCell();
  setBoardWithNextStates();
}
function generateNextForEachCell() {
  for (var column = 0; column < BOARD_COLUMNS; column++) {
    for (var row = 0; row < BOARD_ROWS; row++) {
      generateNextCell(column, row);
    }
  }
}
function generateNextCell(column, row) {
  const cell = { board, column, row };
  const liveAround = countLiveAround(cell);
  if (cellIsDead(cell)) {
    generateForDeadCell(liveAround, cell);
  } else {
    generateForAliveCell(liveAround, cell);
  }
}
function cellIsDead(cell) {
  return cell.board[cell.column][cell.row] == IS_DEAD;
}
function generateForDeadCell(liveAround, cell) {
  if (cellMustBorn(liveAround)) {
    setNextCellAlive(cell);
  }
}
function generateForAliveCell(liveAround, cell) {
  if (cellMustDie(liveAround)) {
    setNextCellDead(cell);
  } else {
    setNextCellAlive(cell);
  }
}
function setNextCellDead(cell) {
  nextBoard[cell.column][cell.row] = IS_DEAD;
}
function setNextCellAlive(cell) {
  nextBoard[cell.column][cell.row] = IS_ALIVE;
}
function cellMustBorn(liveAround) {
  return liveAround == BIRTH_POPULATION;
}
function cellMustDie(liveAround) {
  return isAlone(liveAround) || isFull(liveAround);
}
function isAlone(liveAround) {
  return liveAround < UNDER_POPULATION;
}
function isFull(liveAround) {
  return liveAround > OVER_POPULATION;
}
function setBoardWithNextStates() {
  previousBoard = board;
  board = nextBoard;
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
  canvas.width = BOARD_COLUMNS * CELL_SQUARE_PIXELS;
  canvas.height = BOARD_ROWS * CELL_SQUARE_PIXELS;
  canvas.style.width = canvas.width;
  canvas.style.height = canvas.height;
}
function getCanvasClearContext(canvas) {
  const CONTEXT_DIMENSION = "2d";
  const context = canvas.getContext(CONTEXT_DIMENSION);
  context.fillStyle = DEAD_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return context;
}
function fillCanvasContext(context) {
  for (var column = 0; column < BOARD_COLUMNS; column++) {
    for (var row = 0; row < BOARD_ROWS; row++) {
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
  context.fillStyle = ALIVE_COLOR;
  context.fillRect(
    column * CELL_SQUARE_PIXELS,
    row * CELL_SQUARE_PIXELS,
    CELL_SQUARE_PIXELS,
    CELL_SQUARE_PIXELS
  );
}
function countLiveAround(cell) {
  let liveAround = 0;
  const leftColumn = cell.column - 1;
  const rightColumn = cell.column + 1;
  const topRow = cell.row - 1;
  const bottomRow = cell.row + 1;
  liveAround += countIfAlive(leftColumn, topRow);
  liveAround += countIfAlive(leftColumn, cell.row);
  liveAround += countIfAlive(leftColumn, bottomRow);
  liveAround += countIfAlive(cell.column, topRow);
  liveAround += countIfAlive(cell.column, bottomRow);
  liveAround += countIfAlive(rightColumn, topRow);
  liveAround += countIfAlive(rightColumn, cell.row);
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
  return columnAfterStart(column) && columnBeforeEnd(column);
}
function columnAfterStart(column) {
  return column >= 0;
}
function columnBeforeEnd(column) {
  return column < BOARD_COLUMNS;
}

function rowIsInBoard(row) {
  return rowIsAfterInit(row) && rowIsBeforeEnd(row);
}
function rowIsAfterInit(row) {
  return row >= 0;
}
function rowIsBeforeEnd(row) {
  return row < BOARD_ROWS;
}
function cellIsAlive(column, row) {
  return board[column][row] == IS_ALIVE;
}
function testInitialization() {
  console.group("Initialization Ok");
  testBoardsSize();
  testBoardsContents();
  console.groupEnd();
}
function testBoardsSize() {
  testBoardSize(board);
  console.log("board size ok");
  testBoardSize(nextBoard);
  console.log("nextBoard size ok");
}
function testBoardSize(board) {
  console.assert(hasBegin(board), `hasBegin`, board);
  console.assert(hasEnd(board), `hasEnd`, board);
  console.assert(isNotLarger(board), `isNotLarger`, board);
}
function hasBegin(board) {
  return board[0][0] !== null;
}
function hasEnd(board) {
  const LAST_COLUMN = BOARD_COLUMNS - 1;
  const LAST_ROW = BOARD_ROWS - 1;
  return board[LAST_COLUMN][LAST_ROW] !== null;
}
function isNotLarger(board) {
  return noExtraColumn(board) && noExtraRow(board);
}
function noExtraColumn(board) {
  return board[BOARD_COLUMNS] == undefined;
}
function noExtraRow(board) {
  return board[0][BOARD_ROWS] == undefined;
}
function testBoardsContents() {
  testEachCellContent(board);
  console.log("board contents ok");
  testEachCellContent(nextBoard);
  console.log("nextBoard contents ok");
}
function testEachCellContent(board) {
  board.forEach(column => {
    column.forEach(row => {
      console.assert(testCell(row), `testCell`, row);
    });
  });
}
function testCell(cell) {
  return cell === IS_ALIVE || cell === IS_DEAD;
}
function testUpdateIterations() {
  generationTests++;
  testGoLRules();
}
function testGoLRules() {
  console.group(`iterate generation ${generationTests}`);
  for (var column = 0; column < BOARD_COLUMNS; column++) {
    for (var row = 0; row < BOARD_ROWS; row++) {
      testIfTransitionWasOkForCell(column, row);
    }
  }
  console.log("Test GoL rules end");
  console.groupEnd();
}
function testIfTransitionWasOkForCell(column, row) {
  const previousStatus = previousBoard[column][row];
  const currentStatus = board[column][row];
  const liveAround = countLiveAround(previousBoard, column, row);
  const transition = {
    previousStatus,
    currentStatus,
    column,
    row,
    liveAround
  };
  if (previousStatus == IS_ALIVE) {
    testTransitionFromAliveCell(transition);
  } else {
    testTransitionFromDeadCell(transition);
  }
}
function testTransitionFromAliveCell(transition) {
  if (transition.currentStatus == IS_ALIVE) {
    testIfWasOkToKeepAlive(transition);
  } else {
    testIfWasOKtoDieByWrongPopulation(transition);
  }
}
function testIfWasOkToKeepAlive(transition) {
  console.assert(wasOkToKeepAlive(transition), {
    message: "wasOkToKeepAlive",
    transition
  });
}
function wasOkToKeepAlive(transition) {
  return is1G() || transition.liveAround <= OVER_POPULATION;
}
function is1G() {
  return generationTests == 1;
}
function testIfWasOKtoDieByWrongPopulation(transition) {
  console.assert(wasOKtoDieByWrongPopulation(transition), {
    message: "wasOKtoDieByWrongPopulation",
    transition
  });
}
function wasOKtoDieByWrongPopulation(transition) {
  return (
    transition.liveAround < UNDER_POPULATION ||
    transition.liveAround > OVER_POPULATION
  );
}
function testTransitionFromDeadCell(transition) {
  if (transition.currentStatus == IS_ALIVE) {
    testIfWasOkToHaveBorn(transition);
  } else {
    testIfWasOkToNotBorn(transition);
  }
}
function testIfWasOkToHaveBorn(transition) {
  console.assert(wasOkToHaveBorn(), {
    message: "wasOkToHaveBorn",
    transition
  });
}
function wasOkToHaveBorn(transition) {
  return is1G() || transition.liveAround === BIRTH_POPULATION;
}
function testIfWasOkToNotBorn(transition) {
  console.assert(wasOkToNotBorn(transition), {
    message: "wasOkToNotBorn",
    transition
  });
}
function wasOkToNotBorn(transition) {
  return is1G() || transition.liveAround < BIRTH_POPULATION;
}
function stopOrKeepTesting() {
  if (keepTesting()) {
    setTimeout(mainGameLoop, DELAY_MS);
  } else {
    console.log("Test end!!!");
    console.groupEnd();
  }
}
function keepTesting() {
  const TIMING_TEST_MS = 5000;
  const now = Date.now();
  const workedTime = now - INITIALIZATION_TIME;
  return workedTime < TIMING_TEST_MS;
}
