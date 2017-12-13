import { Index } from "./index.js";

export class Board {
  constructor(columns, rows, creatorCallback) {
    this._columns = columns;
    this._rows = rows;
    this._creatorCallback = creatorCallback;
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
        const newItem = this._creatorCallback(index);
        this.setItem(index, newItem);
      }
    }
  }

  map(callback) {
    this.forEach(item => {
      const mapped = callback(item);
      this.setItem(item.index, mapped);
    });
  }
  forEach(callback) {
    this._board.forEach(column => {
      column.forEach(item => callback(item));
    });
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
