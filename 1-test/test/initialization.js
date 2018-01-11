export function testInitialization(game) {
  console.group("describe main grid");
  testGrid(game, game.grid);
  console.groupEnd();
  console.group("describe next state grid");
  testGrid(game, game.gridNext);
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
      hasEnd(grid, game.gridWidth, game.gridHeight),
      `has no end`,
      game.grid
    );
    console.assert(
      isNotOversized(grid, game.gridWidth, game.gridHeight),
      `is oversized`,
      game.grid
    );
  }
  function hasBegin(grid) {
    return grid[0][0] !== null;
  }
  function hasEnd(grid, gridWidth, gridHeight) {
    return grid[gridWidth - 1][gridHeight - 1] !== null;
  }
  function isNotOversized(grid, gridWidth, gridHeight) {
    return (
      grid[gridWidth] == undefined &&
      grid[0][gridHeight] == undefined
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
