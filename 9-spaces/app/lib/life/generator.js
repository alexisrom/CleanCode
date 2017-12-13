export class Generator {
  constructor(gameConfig, board, counter, judge, executor) {
    this._gameConfig = gameConfig;
    this._board = board;
    this._counter = counter;
    this._judge = judge;
    this._executor = executor;
  }

  initializeState(cell) {
    if (this._judge.canBeAlive()) {
      this._executor.setCellAlive(cell);
    } else {
      this._executor.setCellDead(cell);
    }
    return cell;
  }

  generateNextState(cell) {
    this._setLifeAroundCell(cell);
    if (this._cellIsDead(cell)) {
      this._generateForDeadCell(cell);
    } else {
      this._generateForAliveCell(cell);
    }
    return cell;
  }
  _setLifeAroundCell(cell) {
    cell.lifeAround = this._counter.countLifeAround(cell);
    return cell;
  }
  _cellIsDead(cell) {
    return cell.state == this._gameConfig.IS_DEAD;
  }
  _generateForDeadCell(cell) {
    if (this._judge.cellMustBorn(cell)) {
      this._executor.setCellAlive(cell);
    }
  }
  _generateForAliveCell(cell) {
    if (this._judge.cellMustDie(cell)) {
      this._executor.setCellDead(cell);
    } else {
      this._executor.setCellAlive(cell);
    }
  }
}
