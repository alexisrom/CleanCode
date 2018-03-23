export class Executor {
  constructor(config) {
    this._config = config;
  }

  setDead(item) {
    item.status.next = this._config.DEAD;
  }
  setAlive(item) {
    item.status.next = this._config.ALIVE;
  }
  updateStatus(item) {
    item.status.former = item.status.current;
    item.status.current = item.status.next;
    item.status.generation++;
  }
}
