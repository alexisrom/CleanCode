import { Cell } from "./cell.js";
import { Index } from "./index.js";
export class Board {
  INIT_COLUMN = 0;
  INIT_ROW = 0;

  constructor(columns, rows) {
    this.columns = columns;
    this.rows = rows;
    this._createBoard();
  }

  forEach(callback) {
    this._board.forEach(column => {
      column.forEach(item => {
        callback(item, item.index, this);
      });
    });
  }
  isOnBoard(index) {
    const columns = this._board.length;
    return (
      index.column >= this.INIT_COLUMN &&
      index.column < this._board.length &&
      index.row >= this.INIT_ROW &&
      index.row < this._board[columns - 1].length
    );
  }
  getItem(index) {
    if (this._board[index.column]) {
      return this._board[index.column][index.row];
    } else {
      return undefined;
    }
  }
  setItem(item) {
    const index = item.index;
    if (this._board[index.column]) {
      item.index = index;
      this._board[index.column][index.row] = item;
    }
  }

  _createBoard() {
    this._board = [];
    for (
      let column = this.INIT_COLUMN;
      column < this.columns;
      column++
    ) {
      this._board[column] = [];
      for (var row = this.INIT_ROW; row < this.rows; row++) {
        const index = new Index(column, row);
        const newCell = new Cell(index);
        this.setItem(newCell);
      }
    }
  }
}
