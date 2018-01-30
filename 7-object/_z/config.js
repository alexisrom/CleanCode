export const GAME_CONFIG = {
  COLUMNS: 140,
  ROWS: 70,
  IS_DEAD: 0,
  IS_ALIVE: 1,
  REPRODUCTION: 3,
  UNDER_POPULATION: 2,
  OVER_POPULATION: 3,
  LIFE_PROBABILITY: 0.44
};

export const CANVAS_CONFIG = {
  DEAD_COLOR: "#eee",
  ALIVE_COLOR: "#0080ff",
  CELL_SQUARE_PXS: 10,
  CANVAS_ID: "gameCanvas"
};

export const TEST_CONFIG = {
  DELAY_MS: 50,
  INITIALIZATION_TIME: Date.now(),
  TIMING_TEST_MS: 5000,
  generations: 0
};
