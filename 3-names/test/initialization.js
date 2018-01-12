export function testInitialization(game) {
  game.initializeBoard();
  console.group("describe main grid");
  testGrid(game, game.board);
  console.groupEnd();
  console.group("describe next state grid");
  testGrid(game, game.nextBoard);
  console.groupEnd();
}
function testGrid(game, grid) {
  sizeGrid(game, grid);
  contentGrid(grid);
}
function sizeGrid(game, grid) {
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
function contentGrid(grid) {
  console.group("it should have a correct content");
  grid.forEach(column => {
    column.forEach(row => {
      console.assert(valueOK(row), `has invalid data`, row);
    });
  });
  console.groupEnd();
  function valueOK(value) {
    return Array.isArray(value) || value === 1 || value === 0;
  }
}
