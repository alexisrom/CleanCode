export function testInitialization(game) {
  console.group("describe initialization");
  testGrid(game, game.grid, 'main');
  testGrid(game, game.gridNext, 'next');
  console.groupEnd();
}
function testGrid(game, grid, name) {
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
  function testContentGrid() {
    console.group("it should have a correct content");
    grid.forEach(column => {
      column.forEach(row => {
        console.assert(isValueOK(row), `has invalid data`, row);
      });
    });
    console.groupEnd();
    function isValueOK(value) {
      return Array.isArray(value) || value === 1 || value === 0;
    }
  }
}
