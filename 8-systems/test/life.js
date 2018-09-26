export function testLife(main) {
  console.group("describe life iterations");
  for (let i = 0; i < 2; i++) {
    testIteration(main, i);
  }
  console.groupEnd();
}
function testIteration(main, iteration) {
  console.group("it should live on iteration " + iteration);
  main.updateIteration();
  main.board.forEach(testCell);
  console.groupEnd();
  function testCell(cell) {
    if (cell.status.former == main.CONFIG.IS_DEAD) {
      testTransitionForDead();
    } else {
      testTransitionForAlive();
    }
    function testTransitionForDead() {
      if (
        cell.status.generation == 1 ||
        cell.lifeAround == main.CONFIG.REPRODUCTION_POPULATION
      ) {
        console.assert(
          cell.status.current == main.CONFIG.IS_ALIVE,
          {
            message: "should have born",
            cell
          }
        );
      } else {
        console.assert(
          cell.status.current == main.CONFIG.IS_DEAD,
          {
            message: "should keep dead",
            cell
          }
        );
      }
    }
    function testTransitionForAlive() {
      if (
        cell.lifeAround < main.CONFIG.UNDER_POPULATION ||
        cell.lifeAround > main.CONFIG.OVER_POPULATION
      ) {
        console.assert(
          cell.status.current == main.CONFIG.IS_DEAD,
          {
            message: "should die",
            cell
          }
        );
      } else {
        console.assert(
          cell.status.current == main.CONFIG.IS_ALIVE,
          {
            message: "should keep alive",
            cell
          }
        );
      }
    }
  }
}
