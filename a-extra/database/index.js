export class Index {
  constructor(column, row) {
    (this._column = column), (this._row = row);
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
