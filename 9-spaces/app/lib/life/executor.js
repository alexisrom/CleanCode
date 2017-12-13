export class Executor {
  constructor(config) {
    this._config = config;
  }

  setDead(item) {
    item.state = this._config.IS_DEAD;
  }
  setAlive(item) {
    item.state = this._config.IS_ALIVE;
  }
}
