import { game } from "../main.js";
import { testInitialization } from "./initialization.js";
import { testLife } from "./life.js";

console.clear();
testGame();
console.info("Start Visual Game Of Life");
game.loopGame();

function testGame() {
  console.group("describe Game of life...");
  testInitialization(game);
  testLife(game);
  console.groupEnd();
}
