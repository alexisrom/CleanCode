export class Counter {
  constructor(gameConfig, board) {
    this._gameConfig = gameConfig;
    this._board = board;
  }

  countLifeAround(item) {
    let liveAround = 0;
    const column = item.index.column;
    const row = item.index.row;
    const leftColumn = column - 1;
    const rightColumn = column + 1;
    const topRow = row - 1;
    const bottomRow = row + 1;
    liveAround += this._countIfAlive(leftColumn, topRow);
    liveAround += this._countIfAlive(leftColumn, row);
    liveAround += this._countIfAlive(leftColumn, bottomRow);
    liveAround += this._countIfAlive(column, topRow);
    liveAround += this._countIfAlive(column, bottomRow);
    liveAround += this._countIfAlive(rightColumn, topRow);
    liveAround += this._countIfAlive(rightColumn, row);
    liveAround += this._countIfAlive(rightColumn, bottomRow);
    return liveAround;
  }
  _countIfAlive(column, row) {
    const item = this._board.getItemByColumnRow(column, row);
    return this._isAlive(item);
  }
  _isAlive(item) {
    if (item) {
      return item.state == this._gameConfig.IS_ALIVE;
    } else {
      return false;
    }
  }
}
