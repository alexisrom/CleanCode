export class Judge {
  constructor(config) {
    this._config = config;
  }

  canBeAlive() {
    const randomProbability = Math.random();
    return randomProbability > this._config.LIFE_PROBABILITY;
  }
  cellMustBorn(cell) {
    return cell.lifeAround == this._config.REPRODUCTION;
  }
  cellMustDie(cell) {
    return this.isAlone(cell) || this.isFull(cell);
  }
  isAlone(cell) {
    return cell.lifeAround < this._config.UNDER_POPULATION;
  }
  isFull(cell) {
    return cell.lifeAround > this._config.OVER_POPULATION;
  }
}
