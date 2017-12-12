import { Index } from "./index.js";
import { Cell } from "./cell.js";
export class Board {
  constructor(columns, rows) {
    this._columns = columns;
    this._rows = rows;
    this._createBoard();
  }
  get board() {
    return this._board;
  }
  set board(value) {
    this._board = value;
  }

  _createBoard() {
    this._board = [];
    for (var column = 0; column < this._columns; column++) {
      this._board[column] = [];
      for (var row = 0; row < this._rows; row++) {
        const index = new Index(column, row);
        const newCell = new Cell(null, null, index, 0, 0);
        this.setItem(index, newCell);
      }
    }
  }

  map(callback) {
    for (var column = 0; column < this._columns; column++) {
      for (var row = 0; row < this._rows; row++) {
        const index = new Index(column, row);
        const cloned = this.cloneItem(index);
        const mapped = callback(cloned);
        this.setItem(index, mapped);
      }
    }
  }
  forEach(callback) {
    for (var column = 0; column < this._columns; column++) {
      for (var row = 0; row < this._rows; row++) {
        const index = new Index(column, row);
        const item = this.getItem(index);
        callback(item);
      }
    }
  }
  cloneItem(index) {
    const item = this.getItem(index);
    if (item) {
      return item.clone();
    } else {
      return undefined;
    }
  }
  getItem(index) {
    if (this._board[index.column]) {
      return this._board[index.column][index.row];
    } else {
      return undefined;
    }
  }
  getItemByColumnRow(column, row) {
    const index = new Index(column, row);
    return this.getItem(index);
  }
  setItem(index, item) {
    if (this._board[index.column]) {
      item.index = index;
      this._board[index.column][index.row] = item;
    } else {
      return undefined;
    }
  }
}
