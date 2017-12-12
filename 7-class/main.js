import { TestConfig } from "./config.js";
import { Game } from "./game.js";
import { Test } from "./test.js";

let testConfig = new TestConfig();
let game;

start();
function start() {
  game = new Game();
  Test.initialize(game.board);
  mainGameLoop();
}

function mainGameLoop() {
  game.live();
  Test.live(testConfig, game.board);
  if (keepTesting()) {
    setTimeout(mainGameLoop, testConfig.DELAY_MS);
  }
}

function keepTesting() {
  var now = Date.now();
  var workedTime = now - testConfig.INITIALIZATION_TIME;
  return workedTime < testConfig.TIMING_TEST_MS;
}
