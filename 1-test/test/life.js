export function testLife(game) {
  console.group("describe life iterations");
  for (let i = 0; i < 5; i++) {
    testIteration(game, i);
  }
  console.groupEnd();
}
function testIteration(game, iteration) {
  let formerGrid;
  let nextGrid;
  console.group("it should live on iteration " + iteration);
  iterateGame();
  testGoLRules();
  console.groupEnd();
  function iterateGame() {
    formerGrid = cloneGrid(game, game.grid);
    game.life();
    nextGrid = cloneGrid(game, game.grid);
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
  }
  function testGoLRules() {
    for (let column = 0; column < game.gridWidth; column++) {
      for (let row = 0; row < game.gridHeight; row++) {
        testCell(column, row);
      }
    }
    function testCell(column, row) {
      const status = getStatus(column, row);
      testTransition(status);
      function getStatus(column, row) {
        const formerCell = formerGrid[column][row];
        const nextCell = nextGrid[column][row];
        let lifeCount = countNearby(column, row);
        if (formerCell) {
          lifeCount--;
        }
        return { column, row, lifeCount, formerCell, nextCell };
        function countNearby(column, row) {
          let lifeCounter = 0;
          for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
              countIfAlive(column + x, row + y);
            }
          }
          function countIfAlive(column, row) {
            if (isInGrid(column, row)) {
              if (formerGrid[column][row] == 1) {
                lifeCounter++;
              }
            }
          }
          function isInGrid(column, row) {
            return column >= 0 &&
              row >= 0 &&
              column < game.gridWidth &&
              row < game.gridHeight;
          }
          return lifeCounter;
        }
      }
      function testTransition(status) {
        if (status.formerCell == 0) {
          testTransitionForDead();
        } else {
          testTransitionForAlive();
        }
        function testTransitionForDead() {
          if (status.lifeCount == 3) {
            console.assert(status.nextCell == 1, {
              message: "should have born",
              status
            });
          } else {
            console.assert(status.nextCell == 0, {
              message: "should keep dead",
              status
            });
          }
        }
        function testTransitionForAlive() {
          if (status.lifeCount < 2 || status.lifeCount > 3) {
            console.assert(status.nextCell == 0, {
              message: "should die",
              status
            });
          } else {
            console.assert(status.nextCell == 1, {
              message: "should keep alive",
              status
            });
          }
        }
      }
    }
  }
}
