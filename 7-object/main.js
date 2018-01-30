import { GAME } from "./config/game.js";
import { Game } from "./app/game.js";
import { Painter } from "./app/painter.js";
const initializationTime = Date.now();
const game = new Game();
const painter = new Painter();

function start() {
  initializeBoard();
  loopGame();
}
function initializeBoard() {
  game.initializeBoard();
}
function updateIteration() {
  game.updateIteration();
}
function loopGame() {
  updateIteration();
  painter.drawBoardOnCanvas(game.board);
  stopOrKeepIterations();
}
function stopOrKeepIterations() {
  if (isOverTime()) {
    return;
  } else {
    setTimeout(loopGame, GAME.DELAY_MS);
  }
}
function isOverTime() {
  const now = Date.now();
  const timeRunning = now - initializationTime;
  return timeRunning > GAME.LIVE_GAME_MS;
}

// FOR TESTING PURPOSES
export const main = {
  CONFIG: GAME,
  board: game.board,
  initializeBoard,
  loopGame,
  updateIteration
};
