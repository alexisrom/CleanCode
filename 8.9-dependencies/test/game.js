import { main } from "../main.js";
import { testInitialization } from "./initialization.js";
import { testLife } from "./life.js";

console.clear();
testGame();
console.info("Start Visual Game Of Life");
main.loopGame();

function testGame() {
  console.group("describe Game of life...");
  testInitialization(main);
  testLife(main);
  console.groupEnd();
}
