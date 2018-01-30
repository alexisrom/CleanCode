import { Index } from '../database/index.js';
export function testLife(game) {
  console.group("describe life iterations");
  for (let i = 0; i < 2; i++) {
    testIteration(game, i);
  }
  console.groupEnd();
}
function testIteration(game, iteration) {
  console.group("it should live on iteration " + iteration);
  iterateGame();
  testGoLRules();
  console.groupEnd();
  function iterateGame() {
    game.updateIteration(game.board);
  }
  function testGoLRules() {
    // TO DO: foreEach Cell..
    game.board.forEach(testCell);
    function testCell(cell, index, board) {
      const status = cell.status;
      testLifeCounter(cell, index, board);
      testTransition(status);
      function testLifeCounter(cell, index, board) {
        let lifeAround = countLifeAround(cell, index, board);
        console.assert(cell.status.lifeAround == lifeAround, {
          message: "should count lifeAround",
          cell
        });
        function countLifeAround(cell, index, board) {
          let lifeCounter = 0;
          for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
              countIfAlive(index.column + x, index.row + y, board);
            }
          }
          function countIfAlive(column, row, board) {
            if (isInBoard(column, row)) {
              const neighbor = board.getItem(new Index(column, row));
              if (neighbor.status.former == game.CONFIG.ALIVE) {
                lifeCounter++;
              }
            }
          }
          function isInBoard(column, row) {
            return (
              column >= 0 &&
              row >= 0 &&
              column < game.CONFIG.BOARD_COLUMNS &&
              row < game.CONFIG.BOARD_ROWS
            );
          }
          return lifeCounter;
        }
      }
      function testTransition(status) {
        if (status.former == game.CONFIG.DEAD) {
          testTransitionForDead();
        } else {
          testTransitionForAlive();
        }
        function testTransitionForDead() {
          if (
            status.lifeAround == game.CONFIG.REPRODUCTION_POPULATION
          ) {
            console.assert(status.current == game.CONFIG.ALIVE, {
              message: "should have born",
              status
            });
          } else {
            console.assert(status.current == game.CONFIG.DEAD, {
              message: "should keep dead",
              status
            });
          }
        }
        function testTransitionForAlive() {
          if (
            status.lifeAround < game.CONFIG.UNDER_POPULATION ||
            status.lifeAround > game.CONFIG.OVER_POPULATION
          ) {
            console.assert(status.current == game.CONFIG.DEAD, {
              message: "should die",
              status
            });
          } else {
            console.assert(status.current == game.CONFIG.ALIVE, {
              message: "should keep alive",
              status
            });
          }
        }
      }
    }
  }
}
