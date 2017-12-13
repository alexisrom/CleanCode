export class LifeGenerator {
  constructor(board, config) {
    this._board = board;
    this._config = config;
  }

  initializeState(cell) {
    if (this._canBeAlive()) {
      this._setCellAlive(cell);
    } else {
      this._setCellDead(cell);
    }
    return cell;
  }
  _canBeAlive() {
    const randomProbability = Math.random();
    return randomProbability > this._config.LIFE_PROBABILITY;
  }

  generateNextState(cell) {
    if (this._cellIsDead(cell)) {
      this._generateForDeadCell(cell);
    } else {
      this._generateForAliveCell(cell);
    }
    return cell;
  }
  _cellIsDead(cell) {
    return cell.state == this._config.IS_DEAD;
  }
  _generateForDeadCell(cell) {
    if (this._cellMustBorn(cell)) {
      this._setCellAlive(cell);
    }
  }
  _generateForAliveCell(cell) {
    if (this._cellMustDie(cell)) {
      this._setCellDead(cell);
    } else {
      this._setCellAlive(cell);
    }
  }
  _setCellDead(cell) {
    cell.state = this._config.IS_DEAD;
  }
  _setCellAlive(cell) {
    cell.state = this._config.IS_ALIVE;
  }
  _cellMustBorn(cell) {
    return cell.lifeAround == this._config.REPRODUCTION;
  }
  _cellMustDie(cell) {
    return this._isAlone(cell) || this._isFull(cell);
  }
  _isAlone(cell) {
    return cell.lifeAround < this._config.UNDER_POPULATION;
  }
  _isFull(cell) {
    return cell.lifeAround > this._config.OVER_POPULATION;
  }
}
