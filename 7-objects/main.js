import { GAME } from "./config/game.js";
import { Gamer } from "./lib/gamer.js";
import { Painter } from "./lib/painter.js";
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
function loopGame() {
  updateIteration();
  drawBoardOnCanvas();
  stopOrKeepIterations();
}
function updateIteration() {
  gamer.updateIteration();
}
function drawBoardOnCanvas() {
  painter.drawBoardOnCanvas(gamer.board);
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
