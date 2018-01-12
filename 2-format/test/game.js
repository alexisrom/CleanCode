import { game } from "../game.js";
import { testInitialization } from "./initialization.js";
import { testLife } from "./life.js";

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
  console.group("describe life iterations");
  testLife(game);
  console.groupEnd();
}