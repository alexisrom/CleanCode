export function testInitialization(game) {
  console.group("describe initialization");
  game.initializeBoard();
  testBoard(game, game.board._board);
  console.groupEnd();
}
function testBoard(game, board) {
  console.group(`describe board`);
  testBoardSize();
  testBoardContent();
  console.groupEnd();
  function testBoardSize() {
    console.group("it should have a correct size");
    checkExpects();
    console.groupEnd();
    function checkExpects() {
      console.assert(hasBegin(), `has no begin`, game.board);
      console.assert(hasEnd(), `has no end`, game.board);
      console.assert(
        isNotOversized(),
        `is oversized`,
        game.board
      );
    }
    function hasBegin() {
      return board[0] != null && board[0][0] !== null;
    }
    function hasEnd() {
      const lastColumn = game.CONFIG.BOARD_COLUMNS - 1;
      const lastRow = game.CONFIG.BOARD_ROWS - 1;
      return (
        board[lastColumn] != null &&
        board[lastColumn][lastRow] !== null
      );
    }
    function isNotOversized() {
      return (
        board[game.CONFIG.BOARD_COLUMNS] == undefined &&
        board[0][game.CONFIG.BOARD_ROWS] == undefined
      );
    }
  }
  function testBoardContent() {
    console.group("it should have a correct content");
    board.forEach(column => {
      column.forEach(row => {
        console.assert(
          isValueOK(row.status.current),
          `has invalid data on current`,
          row
        );
        console.assert(
          isValueOK(row.status.next),
          `has invalid data on next`,
          row
        );
      });
    });
    console.groupEnd();
    function isValueOK(value) {
      return (
        value === game.CONFIG.IS_ALIVE ||
        value === game.CONFIG.IS_DEAD
      );
    }
  }
}
