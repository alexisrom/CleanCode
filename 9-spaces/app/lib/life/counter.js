export class Counter {
  constructor(board, config) {
    this._board = board;
    this._config = config;
  }

  countLifeAround(cell) {
    var liveAround = 0;
    var cellColumn = cell.index.column;
    var cellRow = cell.index.row;
    var leftColumn = cellColumn - 1;
    var rightColumn = cellColumn + 1;
    var topRow = cellRow - 1;
    var bottomRow = cellRow + 1;
    liveAround += this._countIfAlive(leftColumn, topRow);
    liveAround += this._countIfAlive(leftColumn, cellRow);
    liveAround += this._countIfAlive(leftColumn, bottomRow);
    liveAround += this._countIfAlive(cellColumn, topRow);
    liveAround += this._countIfAlive(cellColumn, bottomRow);
    liveAround += this._countIfAlive(rightColumn, topRow);
    liveAround += this._countIfAlive(rightColumn, cellRow);
    liveAround += this._countIfAlive(rightColumn, bottomRow);
    return liveAround;
  }
  _countIfAlive(column, row) {
    const cell = this._getCellIfAny(column, row);
    if (cell) {
      return this._cellIsAlive(cell);
    } else {
      return false;
    }
  }
  _getCellIfAny(column, row) {
    return this._board.getItemByColumnRow(column, row);
  }
  _cellIsAlive(cell) {
    return cell.state == this._config.IS_ALIVE;
  }
}
