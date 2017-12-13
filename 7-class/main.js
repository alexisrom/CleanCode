import { GAME_CONFIG, CANVAS_CONFIG, TEST_CONFIG } from "./config.js";
import { Game } from "./game.js";
import { Test } from "./test.js";

let game;

start();
function start() {
  game = new Game(GAME_CONFIG, CANVAS_CONFIG);
  Test.initialize(game.board);
  mainGameLoop();
}

function mainGameLoop() {
  game.live();
  Test.live(TEST_CONFIG, game.board);
  if (keepTesting()) {
    setTimeout(mainGameLoop, TEST_CONFIG.DELAY_MS);
  }
}

function keepTesting() {
  var now = Date.now();
  var workedTime = now - TEST_CONFIG.INITIALIZATION_TIME;
  return workedTime < TEST_CONFIG.TIMING_TEST_MS;
}
