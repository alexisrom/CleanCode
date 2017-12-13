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
  constructor(index, state, previous, generation, lifeAround) {
    this._index = index ? index : new Index();
    this._state = state;
    this._previous = previous;
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
      this._index,
      this._state,
      this._previous,
      this._generation,
      this._lifeAround
    );
  }
}

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
    for (let column = 0; column < this._columns; column++) {
      this._board[column] = [];
      for (let row = 0; row < this._rows; row++) {
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
  setItem(index, item) {
    if (this._board[index.column]) {
      item.index = index;
      this._board[index.column][index.row] = item;
    }
  }
}
