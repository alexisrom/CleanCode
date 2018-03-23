export class Initializer {
  constructor(judge, executor) {
    this._judge = judge;
    this._executor = executor;
  }

  initializeItem(item) {
    if (this._judge.canBorn()) {
      this._executor.setAlive(item);
    } else {
      this._executor.setDead(item);
    }
    this._executor.updateStatus(item);
  }
}
