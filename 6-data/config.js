export const config = {
  COLUMNS: 140
};

export class Config {
  constructor() {
    this.COLUMNS = 140;
    this.ROWS = 70;
    this.IS_DEAD = 0;
    this.IS_ALIVE = 1;
    this.REPRODUCTION = 3;
    this.UNDER_POPULATION = 2;
    this.OVER_POPULATION = 3;
  }
}
export class CanvasConfig {
  constructor() {
    this.DEAD_COLOR = "#eee";
    this.ALIVE_COLOR = "#0080ff";
    this.CELL_SQUARE_PXS = 10;
  }
}
export class TestConfig {
  constructor() {
    this.DELAY_MS = 50;
    this.INITIALIZATION_TIME = Date.now();
    this.TIMING_TEST_MS = 5000;
    this.generations = 0;
  }
}
