import { game } from "../game.js";
import { testInitialization } from "./initialization.js";
import { testLifeIterations } from "./life.js";

console.clear();
testGame();
console.info("Start Visual Game Loop");
game.gameLoop();

function testGame() {
  console.group("describe Game of life...");
  testInitialization(game);
  testLifeIterations(game, 5);
  console.groupEnd();
}
