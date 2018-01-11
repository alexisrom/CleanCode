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
  console.assert(hasBegin(grid), `has no begin`, game.grid);
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
  console.group("it should do first iteration");
  testIteration(true);
  console.groupEnd();
  console.group("it should do second iteration");
  testIteration(false);
  console.groupEnd();
}

function testIteration(isFirst) {
  let cloned = cloneGrid(game.grid);
  game.life();
  testGoLRules(cloned, game.grid, isFirst);
}

function cloneGrid(grid) {
  let newGrid = [];
  let x = 0;
  grid.forEach(column => {
    newGrid.push([]);
    column.forEach(row => {
      newGrid[x].push(row);
    });
    x++;
  });
  return newGrid;
}

function testGoLRules(grid, gridNext, isFirst) {
  for (var x = 0; x < game.gridWidth; x++) {
    for (var y = 0; y < game.gridHeight; y++) {
      var currentCell = grid[x][y];
      var nextCell = gridNext[x][y];
      testTransitionOk(
        currentCell,
        nextCell,
        x,
        y,
        grid,
        isFirst
      );
    }
  }
  function testTransitionOk(
    current,
    next,
    x,
    y,
    grid,
    isFirst
  ) {
    var count = game.countNearby(x, y, grid);
    var status = { current, next, x, y, count };
    if (current == 1) {
      if (next == 1) {
        console.assert(isFirst || count <= 3, {
          message: "should die but wasOkToKeepAlive",
          status
        });
      } else {
        console.assert(count > 3, {
          message: "should keep alive but diesByOverPopulation",
          status
        });
      }
    } else {
      if (next == 1) {
        console.assert(count === 3, {
          message: "should keep dead but isNewBorn",
          status
        });
      } else {
        console.assert(isFirst || count < 3, {
          message: "should have born but notEnoughToBorn",
          status
        });
      }
    }
  }
}
