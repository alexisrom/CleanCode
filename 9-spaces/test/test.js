export let Test = {
  initialize: function initialize(board, config) {
    console.clear();
    console.group("initialize");
    this.boardSize(board, config);
    this.boardContents(board, config);
    console.groupEnd();
  },
  boardSize: function boardSize(board, config) {
    console.assert(this.hasBegin(board), `hasBegin`, board);
    console.assert(this.hasEnd(board, config), `hasEnd`, board);
    console.assert(this.isSmall(board, config), `isSmall`, board);
  },
  hasBegin: function hasBegin(board) {
    return board.getItemByColumnRow(0, 0) !== null;
  },
  hasEnd: function hasEnd(board, config) {
    const lastColumn = config.COLUMNS - 1;
    const lastRow = config.ROWS - 1;
    return board.getItemByColumnRow(lastColumn, lastRow) !== null;
  },
  isSmall: function isSmall(board, config) {
    return this.noExtraColumn(board, config) && this.noExtraRow(board, config);
  },
  noExtraColumn: function noExtraColumn(board, config) {
    return board.getItemByColumnRow(config.COLUMNS, 0) == undefined;
  },
  noExtraRow: function noExtraRow(board, config) {
    return board.getItemByColumnRow(0, config.ROWS) == undefined;
  },
  boardContents: function boardContents(board, config) {
    board.forEach(cell => {
      cell === config.IS_ALIVE || cell === config.IS_DEAD;
    });
    console.log("board contents ok");
  },
  live: function live(board, config, testConfig) {
    testConfig.generations++;
    console.group(`generation ${testConfig.generations}`);
    console.table(board);
    this.golRules(board, config);
    console.groupEnd();
  },
  golRules: function golRules(board, config) {
    board.forEach(cell => {
      if (cell.previous == config.IS_ALIVE) {
        this.fromAlive(cell, config);
      } else {
        this.fromDead(cell, config);
      }
    });
    console.log("Test GoL rules end");
  },
  fromAlive: function fromAlive(cell, config) {
    if (cell.state == config.IS_ALIVE) {
      this.keepAlive(cell, config);
    } else {
      this.kill(cell, config);
    }
  },
  keepAlive: function keepAlive(cell, config) {
    console.assert(cell.lifeAround <= config.OVER_POPULATION, {
      message: "wasOkToKeepAlive",
      cell
    });
  },
  kill: function kill(cell, config) {
    console.assert(
      cell.lifeAround <= config.UNDER_POPULATION ||
        cell.lifeAround > config.OVER_POPULATION,
      {
        message: "wasOKtoDieByWrongPopulation",
        cell
      }
    );
  },
  fromDead: function fromDead(cell, config) {
    if (cell.state == config.IS_ALIVE) {
      this.born(cell, config);
    } else {
      this.notBorn(cell, config);
    }
  },
  born: function born(cell, config) {
    if (this.isFirstGeneration(cell)) return;
    console.assert(cell.lifeAround === config.REPRODUCTION, {
      message: "wasOkToHaveBorn",
      cell
    });
  },
  notBorn: function notBorn(cell, config) {
    if (this.isFirstGeneration(cell)) return;
    console.assert(cell.lifeAround < config.REPRODUCTION, {
      message: "wasOkToNotBorn",
      cell
    });
  },
  isFirstGeneration: function isFirstGeneration(cell) {
    return cell.previous == null;
  }
};
