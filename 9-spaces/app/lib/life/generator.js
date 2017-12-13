export class Generator {
  constructor(gameConfig, board, counter, judge, executor) {
    this._gameConfig = gameConfig;
    this._board = board;
    this._counter = counter;
    this._judge = judge;
    this._executor = executor;
  }

  initializeState(item) {
    if (this._judge.canBeAlive()) {
      this._executor.setAlive(item);
    } else {
      this._executor.setDead(item);
    }
    return item;
  }

  generateNextState(item) {
    this._setLifeAround(item);
    if (this._cellIsDead(item)) {
      this._generateForDead(item);
    } else {
      this._generateForAlive(item);
    }
    return item;
  }
  _setLifeAround(item) {
    item.lifeAround = this._counter.countLifeAround(item);
    return item;
  }
  _cellIsDead(item) {
    return item.state == this._gameConfig.IS_DEAD;
  }
  _generateForDead(item) {
    if (this._judge.mustBorn(item)) {
      this._executor.setAlive(item);
    }
  }
  _generateForAlive(item) {
    if (this._judge.mustDie(item)) {
      this._executor.setDead(item);
    } else {
      this._executor.setAlive(item);
    }
  }
}
