export function testInitialization(game) {
  game.initializeBoard();
  console.group("describe main grid");
  testBoard(game, game.board);
  console.groupEnd();
  console.group("describe next state grid");
  testBoard(game, game.nextBoard);
  console.groupEnd();
}
function testBoard(game, grid) {
  testBoardSize(game, grid);
  testBoardContent(grid);
}
function testBoardSize(game, grid) {
  console.group("it should have a correct size");
  checkExpects();
  console.groupEnd();
  function checkExpects() {
    console.assert(
      hasBegin(grid),
      `should has a begin cell but has no begin`,
      game.grid
    );
    console.assert(
      hasEnd(grid, game.BOARD_COLUMNS, game.BOARD_ROWS),
      `has no end`,
      game.grid
    );
    console.assert(
      isNotOversized(grid, game.BOARD_COLUMNS, game.BOARD_ROWS),
      `is oversized`,
      game.grid
    );
  }
  function hasBegin(grid) {
    return grid[0][0] !== null;
  }
  function hasEnd(grid, BOARD_COLUMNS, BOARD_ROWS) {
    return grid[BOARD_COLUMNS - 1][BOARD_ROWS - 1] !== null;
  }
  function isNotOversized(grid, BOARD_COLUMNS, BOARD_ROWS) {
    return (
      grid[BOARD_COLUMNS] == undefined &&
      grid[0][BOARD_ROWS] == undefined
    );
  }
}
function testBoardContent(grid) {
  console.group("it should have a correct content");
  grid.forEach(column => {
    column.forEach(row => {
      console.assert(
        isCellValueOK(row),
        `has invalid data`,
        row
      );
    });
  });
  console.groupEnd();
  function isCellValueOK(value) {
    return Array.isArray(value) || value === 1 || value === 0;
  }
}
