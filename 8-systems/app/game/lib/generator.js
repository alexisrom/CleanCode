export class Generator {
  constructor(counter, judge, executor) {
    this._counter = counter;
    this._judge = judge;
    this._executor = executor;
  }

  generateNextState(item, index, board) {
    this._counter.countLifeAround(item, index, board);
    if (this._judge.isDead(item)) {
      this._generateFromDead(item);
    } else {
      this._generateFromLiving(item);
    }
  }

  _generateFromDead(item) {
    if (this._judge.mustBorn(item)) {
      this._executor.setAlive(item);
    } else {
      this._executor.setDead(item);
    }
  }
  _generateFromLiving(item) {
    if (this._judge.mustDie(item)) {
      this._executor.setDead(item);
    } else {
      this._executor.setAlive(item);
    }
  }
}
