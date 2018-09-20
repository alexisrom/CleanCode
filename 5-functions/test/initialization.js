export function testInitialization(game) {
  console.group("describe initialization");
  game.initializeBoard();
  testGrid(game, game.board, "main");
  testGrid(game, game.nextBoard, "next");
  console.groupEnd();
}
function testGrid(game, board, name) {
  console.group(`describe ${name} grid`);
  testSizeGrid();
  testContentGrid();
  console.groupEnd();
  function testSizeGrid() {
    console.group("it should have a correct size");
    checkExpects();
    console.groupEnd();
    function checkExpects() {
      console.assert(
        hasBegin(),
        `should has a begin cell but has no begin`,
        game.board
      );
      console.assert(hasEnd(), `has no end`, game.board);
      console.assert(
        isNotOversized(),
        `is oversized`,
        game.board
      );
    }
    function hasBegin() {
      return board[0][0] !== null;
    }
    function hasEnd() {
      const lastColumn = game.COLUMNS - 1;
      const lastRow = game.ROWS - 1;
      return board[lastColumn][lastRow] !== null;
    }
    function isNotOversized() {
      return (
        board[game.COLUMNS] == undefined &&
        board[0][game.ROWS] == undefined
      );
    }
  }
  function testContentGrid() {
    console.group("it should have a correct content");
    board.forEach(column => {
      column.forEach(row => {
        console.assert(isValueOK(row), `has invalid data`, row);
      });
    });
    console.groupEnd();
    function isValueOK(value) {
      return value === game.ALIVE || value === game.DEAD;
    }
  }
}
