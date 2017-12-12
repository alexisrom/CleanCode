import { Index } from "./index.js";
import { Item } from "./item.js";
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
    for (let column = 0; column < this._columns; column++) {
      this._board[column] = [];
      for (let row = 0; row < this._rows; row++) {
        const index = new Index(column, row);
        const item = new Item(index);
        this.setItem(index, item);
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

  getItem(index) {
    if (this._board[index.column]) {
      return this._board[index.column][index.row];
    }
    return null;
  }
  setItem(index, item) {
    item.index = index;
    this._board[index.column][index.row] = item;
  }
}
