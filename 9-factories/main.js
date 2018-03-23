import { GAME } from "./components/game/config/game.js";
import { Board } from "./components/game/database/board.js";
import { Gamer } from "./components/game/lib/gamer.js";
import { Judge } from "./components/game/lib/judge.js";
import { Executor } from "./components/game/lib/executor.js";
import { Painter } from "./components/canvas/lib/painter.js";
const initializationTime = Date.now();
const board = new Board(GAME.BOARD_COLUMNS, GAME.BOARD_ROWS);
const executor = new Executor(GAME);
const judge = new Judge(GAME);
const painter = new Painter(GAME);
const gamer = new Gamer(board, executor, judge, painter);

function start() {
  initializeBoard();
  loopGame();
}
function initializeBoard() {
  gamer.initializeBoard();
}
function loopGame() {
  updateIteration();
  stopOrKeepIterations();
}
function updateIteration() {
  gamer.updateIteration();
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
