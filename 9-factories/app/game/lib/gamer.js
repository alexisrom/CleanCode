import { Counter } from "./counter.js";
import { Generator } from "./generator.js";
import { Initializer } from "./initializer.js";
export class Gamer {
  constructor(board, executor, judge, painter) {
    this.board = board;
    this._executor = executor;
    this._judge = judge;
    this._painter = painter;
    this._createGame();
  }
  initializeBoard() {
    this.board.forEach(this._initializeCell.bind(this));
  }
  updateIteration() {
    this.board.forEach(this._generateNextState.bind(this));
    this.board.forEach(this._updateStatus.bind(this));
    this._drawBoardWithPainter();
  }
  _createGame() {
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
  _initializeCell(cell) {
    this._initializer.initializeItem(cell);
  }
  _generateNextState(cell, item, board) {
    this._generator.generateNextState(cell, item, board);
  }
  _updateStatus(cell) {
    this._executor.updateStatus(cell);
  }
  _drawBoardWithPainter() {
    this._painter.drawBoard(this.board);
  }
}
