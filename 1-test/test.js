console.clear();
import { game } from "./game.js";

console.log("Begin tests...");
console.group("describe initialization");
testInitialization();
console.groupEnd();
console.group("describe GoL rules");
testLife();
console.groupEnd();

function testInitialization() {
  console.group("describe main grid");
  sizeGrid(game.grid);
  contentGrid(game.grid);
  console.groupEnd();
  console.group("describe next state grid");
  sizeGrid(game.gridNext);
  contentGrid(game.gridNext);
  console.groupEnd();
}
function sizeGrid(grid) {
  console.group("it should have a correct size");
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
  console.groupEnd();
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
function testLife() {
  for (let i = 0; i < 100; i++) {
    console.group("it should do iteration: " + i);
    testIteration();
    console.groupEnd();
  }
}
function testIteration() {
  const ancient = cloneGrid(game.grid);
  game.life();
  game.draw();
  const next = cloneGrid(game.grid);
  testGoLRules(ancient, next);
}

function cloneGrid(currentGrid) {
  const newGrid = createNewGrid();
  for (let x = 0; x < game.gridWidth; x++) {
    for (let y = 0; y < game.gridHeight; y++) {
      newGrid[x][y] = currentGrid[x][y];
    }
  }
  function createNewGrid() {
    const newGrid = [];
    for (let x = 0; x < game.gridWidth; x++) {
      newGrid[x] = [];
      for (let y = 0; y < game.gridHeight; y++) {
        newGrid[x][y] = 0;
      }
    }
    return newGrid;
  }
  return newGrid;
}

function testGoLRules(ancientGrid, nextGrid) {
  for (let column = 0; column < game.gridWidth; column++) {
    for (let row = 0; row < game.gridHeight; row++) {
      testCell(column, row);
    }
  }
  function testCell(column, row) {
    const ancient = ancientGrid[column][row];
    const next = nextGrid[column][row];
    const count = countNearby(column, row, ancientGrid);
    const status = { column, row, count, ancient, next };
    testTransitionOk(status);
  }
  function countNearby(x, y) {
    let count = 0;
    counter(x - 1, y - 1);
    counter(x - 1, y);
    counter(x - 1, y + 1);
    counter(x, y - 1);
    counter(x, y + 1);
    counter(x + 1, y - 1);
    counter(x + 1, y);
    counter(x + 1, y + 1);
    function counter(column, row) {
      if (column >= 0 && row >= 0) {
        if (column < game.gridWidth && row < game.gridHeight) {
          if (ancientGrid[column][row] == 1) count++;
        }
      }
    }
    return count;
  }
  function testTransitionOk(status) {
    if (status.ancient == 0) {
      if (status.count == 3) {
        console.assert(status.next == 1, {
          message: "should have born",
          status
        });
      } else {
        console.assert(status.next == 0, {
          message: "should keep dead",
          status
        });
      }
    } else {
      if (status.count < 2 || status.count > 3) {
        console.assert(status.next == 0, {
          message: "should die",
          status
        });
      } else {
        console.assert(status.next == 1, {
          message: "should keep alive",
          status
        });
      }
    }
  }
}
