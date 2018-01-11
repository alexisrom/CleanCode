import { game } from "./game.js";
import { testInitialization } from "./test/initialization.js";
import { testLife } from "./test/life.js";

console.clear();
doTest();
game.gameLoop();

function doTest() {
  console.group("describe Game of life...");
  doTestInitialization();
  doTestLife();
  console.groupEnd();
}
function doTestInitialization() {
  console.group("describe initialization");
  testInitialization(game);
  console.groupEnd();
}
function doTestLife() {
  console.group("describe iterations rules");
  testLife(game);
  console.groupEnd();
}
