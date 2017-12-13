export class Counter {
  constructor(gameConfig, board) {
    this._gameConfig = gameConfig;
    this._board = board;
  }

  countLifeAround(cell) {
    let liveAround = 0;
    const cellColumn = cell.index.column;
    const cellRow = cell.index.row;
    const leftColumn = cellColumn - 1;
    const rightColumn = cellColumn + 1;
    const topRow = cellRow - 1;
    const bottomRow = cellRow + 1;
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
    const cell = this._board.getItemByColumnRow(column, row);
    return this._cellIsAlive(cell);
  }
  _cellIsAlive(cell) {
    if (cell) {
      return cell.state == this._gameConfig.IS_ALIVE;
    } else {
      return false;
    }
  }
}
