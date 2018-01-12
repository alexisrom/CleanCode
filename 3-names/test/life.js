export function testLife(game) {
  const LIFE_ITERATIONS = 10;
  for (
    let iteration = 0;
    iteration < LIFE_ITERATIONS;
    iteration++
  ) {
    console.group("it should live iteration " + iteration);
    testIteration(game);
    console.groupEnd();
  }
}
function testIteration(game) {
  const former = cloneBoard(game, game.board);
  game.updateIteration();
  const next = cloneBoard(game, game.board);
  testGoLRules(game, former, next);
}
function cloneBoard(game, currentBoard) {
  const clonedBoard = createNewBoard();
  for (let column = 0; column < game.BOARD_COLUMNS; column++) {
    for (let row = 0; row < game.BOARD_ROWS; row++) {
      clonedBoard[column][row] = currentBoard[column][row];
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
function testGoLRules(game, formerBoard, nextBoard) {
  for (let column = 0; column < game.BOARD_COLUMNS; column++) {
    for (let row = 0; row < game.BOARD_ROWS; row++) {
      testCell(column, row);
    }
  }
  function testCell(column, row) {
    const former = formerBoard[column][row];
    const next = nextBoard[column][row];
    const count = countLivingNeighbors(column, row, former);
    const status = { column, row, count, former, next };
    testTransitionOk(status);
    function countLivingNeighbors(column, row, ancient) {
      let livingNeighbors = -ancient;
      for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
          countIfAlive(column + x, row + y);
        }
      }
      function countIfAlive(column, row) {
        if (
          column >= 0 &&
          row >= 0 &&
          column < game.BOARD_COLUMNS &&
          row < game.BOARD_ROWS
        ) {
          if (formerBoard[column][row] == 1) livingNeighbors++;
        }
      }
      return livingNeighbors;
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
