export class Index {
  constructor(column, row) {
    this._column = column;
    this._row = row;
  }
  get column() {
    return this._column;
  }
  set column(value) {
    this._column = value;
  }
  get row() {
    return this._row;
  }
  set row(value) {
    this._row = value;
  }
}
export class Cell {
  constructor(state, previous, index, generation, lifeAround) {
    this._state = state;
    this._previous = previous;
    this._index = index ? index : new Index();
    this._generation = generation;
    this._lifeAround = lifeAround;
  }

  get state() {
    return this._state;
  }
  set state(value) {
    this._generation++;
    this._previous = this._state;
    this._state = value;
  }

  get previous() {
    return this._previous;
  }
  set previous(value) {
    this._previous = value;
  }

  get index() {
    return this._index;
  }
  set index(value) {
    this._index = value;
  }

  get lifeAround() {
    return this._lifeAround;
  }
  set lifeAround(value) {
    this._lifeAround = value;
  }

  clone() {
    return new Cell(
      this._state,
      this._previous,
      this._index,
      this._generation,
      this._lifeAround
    );
  }
}

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
  setItem(index, item) {
    if (this._board[index.column]) {
      item.index = index;
      this._board[index.column][index.row] = item;
    }
  }
}
