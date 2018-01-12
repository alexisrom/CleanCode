export function testLife(game) {
  for (let i = 0; i < 20; i++) {
    console.group("it should live iteration " + i);
    testIteration(game);
    console.groupEnd();
  }
}
function testIteration(game) {
  const ancient = cloneGrid(game, game.grid);
  game.life();
  const next = cloneGrid(game, game.grid);
  testGoLRules(game, ancient, next);
}
function cloneGrid(game, currentGrid) {
  const clonedGrid = createNewGrid();
  for (let x = 0; x < game.gridWidth; x++) {
    for (let y = 0; y < game.gridHeight; y++) {
      clonedGrid[x][y] = currentGrid[x][y];
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
  return clonedGrid;
}
function testGoLRules(game, ancientGrid, nextGrid) {
  for (let column = 0; column < game.gridWidth; column++) {
    for (let row = 0; row < game.gridHeight; row++) {
      testCell(column, row);
    }
  }
  function testCell(column, row) {
    const ancient = ancientGrid[column][row];
    const next = nextGrid[column][row];
    const count = countNearby(column, row, ancient);
    const status = { column, row, count, ancient, next };
    testTransitionOk(status);
    function countNearby(column, row, ancient) {
      let count = -ancient;
      for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
          counter(column + x, row + y);
        }
      }
      function counter(column, row) {
        if (
          column >= 0 &&
          row >= 0 &&
          column < game.gridWidth &&
          row < game.gridHeight
        ) {
          if (ancientGrid[column][row] == 1) count++;
        }
      }
      return count;
    }
    function testTransitionOk(status) {
      if (status.ancient == 0) {
        testTransitionForDead();
      } else {
        testTransitionForAlive();
      }
      function testTransitionForDead() {
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
      }
      function testTransitionForAlive() {
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
}
