import { GameConfig } from "./config/game_config.js";
import { CanvasConfig } from "./config/canvas_config.js";
import { TestConfig } from "./config/test_config.js";
import { Game } from "./app/game.js";
import { Test } from "./test/test.js";

let gameConfig = new GameConfig();
let canvasConfig = new CanvasConfig();
let testConfig = new TestConfig();
let game;

start();
function start() {
  game = new Game(gameConfig, canvasConfig);
  Test.initialize(game.board, gameConfig);
  mainGameLoop();
}

function mainGameLoop() {
  game.live();
  Test.live(game.board, gameConfig, testConfig);
  if (keepTesting()) {
    setTimeout(mainGameLoop, testConfig.DELAY_MS);
  }
}

function keepTesting() {
  const now = Date.now();
  const workedTime = now - testConfig.INITIALIZATION_TIME;
  return workedTime < testConfig.TIMING_TEST_MS;
}
