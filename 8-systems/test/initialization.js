export function testInitialization(main) {
  console.group("describe initialization");
  main.initializeBoard();
  testBoard(main, main.board._board);
  console.groupEnd();
}
function testBoard(main, board) {
  console.group(`describe board`);
  testBoardSize();
  testBoardContent();
  console.groupEnd();
  function testBoardSize() {
    console.group("it should have a correct size");
    checkExpects();
    console.groupEnd();
    function checkExpects() {
      console.assert(hasBegin(), `has no begin`, main.board);
      console.assert(hasEnd(), `has no end`, main.board);
      console.assert(
        isNotOversized(),
        `is oversized`,
        main.board
      );
    }
    function hasBegin() {
      return board[0] != null && board[0][0] !== null;
    }
    function hasEnd() {
      const lastColumn = main.CONFIG.BOARD_COLUMNS - 1;
      const lastRow = main.CONFIG.BOARD_ROWS - 1;
      return (
        board[lastColumn] != null &&
        board[lastColumn][lastRow] !== null
      );
    }
    function isNotOversized() {
      return (
        board[main.CONFIG.BOARD_COLUMNS] == undefined &&
        board[0][main.CONFIG.BOARD_ROWS] == undefined
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
        value === main.CONFIG.ALIVE ||
        value === main.CONFIG.DEAD
      );
    }
  }
}
