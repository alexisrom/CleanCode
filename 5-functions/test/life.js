export function testLife(game) {
  console.group("describe life iterations");
  for (let i = 0; i < 2; i++) {
    testIteration(game, i);
  }
  console.groupEnd();
}
function testIteration(game, iteration) {
  let formerBoard;
  let nextBoard;
  console.group("it should live on iteration " + iteration);
  iterateGame();
  testGoLRules();
  console.groupEnd();
  function iterateGame() {
    formerBoard = cloneBoard(game, game.board);
    game.updateIteration(game.board);
    nextBoard = cloneBoard(game, game.board);
    function cloneBoard(game, currentBoard) {
      const clonedBoard = createNewBoard();
      for (let x = 0; x < game.BOARD_COLUMNS; x++) {
        for (let y = 0; y < game.BOARD_ROWS; y++) {
          clonedBoard[x][y] = currentBoard[x][y];
        }
      }
      function createNewBoard() {
        const newBoard = [];
        for (let x = 0; x < game.BOARD_COLUMNS; x++) {
          newBoard[x] = [];
          for (let y = 0; y < game.BOARD_ROWS; y++) {
            newBoard[x][y] = 0;
          }
        }
        return newBoard;
      }
      return clonedBoard;
    }
  }
  function testGoLRules() {
    for (
      let column = 0;
      column < game.BOARD_COLUMNS;
      column++
    ) {
      for (let row = 0; row < game.BOARD_ROWS; row++) {
        testCell(column, row);
      }
    }
    function testCell(column, row) {
      const status = getStatus(column, row);
      testTransition(status);
      function getStatus(column, row) {
        const formerCell = formerBoard[column][row];
        const nextCell = nextBoard[column][row];
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
            if (isInBoard(column, row)) {
              if (formerBoard[column][row] == game.ALIVE) {
                lifeCounter++;
              }
            }
          }
          function isInBoard(column, row) {
            return (
              column >= 0 &&
              row >= 0 &&
              column < game.BOARD_COLUMNS &&
              row < game.BOARD_ROWS
            );
          }
          return lifeCounter;
        }
      }
      function testTransition(status) {
        if (status.formerCell == game.DEAD) {
          testTransitionForDead();
        } else {
          testTransitionForAlive();
        }
        function testTransitionForDead() {
          if (
            status.lifeCount == game.REPRODUCTION_POPULATION
          ) {
            console.assert(status.nextCell == game.ALIVE, {
              message: "should have born",
              status
            });
          } else {
            console.assert(status.nextCell == game.DEAD, {
              message: "should keep dead",
              status
            });
          }
        }
        function testTransitionForAlive() {
          if (
            status.lifeCount < game.UNDER_POPULATION ||
            status.lifeCount > game.OVER_POPULATION
          ) {
            console.assert(status.nextCell == game.DEAD, {
              message: "should die",
              status
            });
          } else {
            console.assert(status.nextCell == game.ALIVE, {
              message: "should keep alive",
              status
            });
          }
        }
      }
    }
  }
}
