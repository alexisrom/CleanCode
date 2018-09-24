export function testLife(game) {
  console.group("describe life iterations");
  for (let i = 0; i < 2; i++) {
    testIteration(game, i);
  }
  console.groupEnd();
}
function testIteration(game, iteration) {
  console.group("it should live on iteration " + iteration);
  game.updateIteration(game.board);
  game.board.forEach(testCell);
  console.groupEnd();
  function testCell(cell) {
    if (cell.status.former == game.CONFIG.IS_DEAD) {
      testTransitionForDead();
    } else {
      testTransitionForAlive();
    }
    function testTransitionForDead() {
      if (
        cell.status.generation == 1 ||
        cell.lifeAround == game.CONFIG.REPRODUCTION_POPULATION
      ) {
        console.assert(
          cell.status.current == game.CONFIG.IS_ALIVE,
          {
            message: "should have born",
            cell
          }
        );
      } else {
        console.assert(
          cell.status.current == game.CONFIG.IS_DEAD,
          {
            message: "should keep dead",
            cell
          }
        );
      }
    }
    function testTransitionForAlive() {
      if (
        cell.lifeAround < game.CONFIG.UNDER_POPULATION ||
        cell.lifeAround > game.CONFIG.OVER_POPULATION
      ) {
        console.assert(
          cell.status.current == game.CONFIG.IS_DEAD,
          {
            message: "should die",
            cell
          }
        );
      } else {
        console.assert(
          cell.status.current == game.CONFIG.IS_ALIVE,
          {
            message: "should keep alive",
            cell
          }
        );
      }
    }
  }
}
