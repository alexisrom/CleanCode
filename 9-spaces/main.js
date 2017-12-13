import { GAME_CONFIG } from "./config/game_config.js";
import { CANVAS_CONFIG } from "./config/canvas_config.js";
import { TEST_CONFIG } from "./config/test_config.js";
import { Game } from "./app/game.js";
import { Test } from "./test/test.js";
let game;

start();
function start() {
  game = new Game(GAME_CONFIG, CANVAS_CONFIG);
  Test.initialize(game.board, GAME_CONFIG);
  mainGameLoop();
}

function mainGameLoop() {
  game.live();
  Test.live(game.board, GAME_CONFIG, TEST_CONFIG);
  if (keepTesting()) {
    setTimeout(mainGameLoop, TEST_CONFIG.DELAY_MS);
  }
}

function keepTesting() {
  const now = Date.now();
  const workedTime = now - TEST_CONFIG.INITIALIZATION_TIME;
  return workedTime < TEST_CONFIG.TIMING_TEST_MS;
}
