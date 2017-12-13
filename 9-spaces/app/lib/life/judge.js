export class Judge {
  constructor(config) {
    this._config = config;
  }

  canBeAlive() {
    const randomProbability = Math.random();
    return randomProbability > this._config.LIFE_PROBABILITY;
  }
  mustBorn(item) {
    return item.lifeAround == this._config.REPRODUCTION;
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
