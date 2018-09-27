export class Judge {
  constructor(config) {
    this._config = config;
  }

  isAlive(item) {
    return item.status.current === this._config.IS_ALIVE;
  }
  isDead(item) {
    return item.status.current === this._config.IS_DEAD;
  }
  canBorn() {
    const randomProbability = Math.random();
    return randomProbability > this._config.LIFE_PROBABILITY;
  }
  mustBorn(item) {
    return (
      item.lifeAround == this._config.REPRODUCTION_POPULATION
    );
  }
  mustDie(item) {
    return this._isAlone(item) || this._isFull(item);
  }
  _isAlone(item) {
    return item.lifeAround < this._config.UNDER_POPULATION;
  }
  _isFull(item) {
    return item.lifeAround > this._config.OVER_POPULATION;
  }
}
