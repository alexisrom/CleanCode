import { GAME } from "../config/game.js";
import { Board } from "../database/board.js";

import { Counter } from "./counter.js";
import { Judge } from "./judge.js";
import { Executor } from "./executor.js";
import { Generator } from "./generator.js";
import { Initializer } from "./initializer.js";
export class Gamer {
  constructor() {
    this.board = new Board(GAME.BOARD_COLUMNS, GAME.BOARD_ROWS);
    this._judge = new Judge(GAME);
    this._executor = new Executor(GAME);
    this._counter = new Counter(this._judge);
    this._initializer = new Initializer(
      this._judge,
      this._executor
    );
    this._generator = new Generator(
      this._counter,
      this._judge,
      this._executor
    );
  }
  initializeBoard() {
    this.board.forEach(this._initializeCell.bind(this));
  }
  updateIteration() {
    this.board.forEach(this._generateNextState.bind(this));
    this.board.forEach(this._updateStatus.bind(this));
  }
  _initializeCell(cell) {
    this._initializer.initializeItem(cell);
  }
  _generateNextState(cell, item, board) {
    this._generator.generateNextState(cell, item, board);
  }
  _updateStatus(cell) {
    this._executor.updateStatus(cell);
  }
}
