import { GAME } from "./config/game.js";
import { Gamer } from "./app/gamer.js";
import { Painter } from "./app/painter.js";
const initializationTime = Date.now();
const gamer = new Gamer();
const painter = new Painter();

function start() {
  initializeBoard();
  loopGame();
}
function initializeBoard() {
  gamer.initializeBoard();
}
function updateIteration() {
  gamer.updateIteration();
}
function loopGame() {
  updateIteration();
  painter.drawBoardOnCanvas(gamer.board);
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
  board: gamer.board,
  initializeBoard,
  loopGame,
  updateIteration
};
