export class Executor {
  constructor(config) {
    this._config = config;
  }

  setCellDead(cell) {
    cell.state = this._config.IS_DEAD;
  }
  setCellAlive(cell) {
    cell.state = this._config.IS_ALIVE;
  }
}