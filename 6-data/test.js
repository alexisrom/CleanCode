import { Index } from './data.js';
import { Config } from './config.js';
let config = new Config();
export let Test = {
  initialize: function initialize(board) {
    console.clear();
    console.group('initialize');
    this.boardSize(board);
    this.boardContents(board);
    console.groupEnd();
  },
  boardSize: function boardSize(board) {
    console.assert(this.hasBegin(board), `hasBegin`, board);
    console.assert(this.hasEnd(board), `hasEnd`, board);
    console.assert(this.isSmall(board), `isSmall`, board);
  },
  hasBegin: function hasBegin(board) {
    const index = new Index(0, 0);
    return board.getItem(index) !== null;
  },
  hasEnd: function hasEnd(board) {
    const lastColumn = config.BOARD_COLUMNS - 1;
    const lastRow = config.BOARD_ROWS - 1;
    const index = new Index(lastColumn, lastRow);
    return board.getItem(index) !== null;
  },
  isSmall: function isNotLarger(board) {
    return this.noExtraColumn(board) && this.noExtraRow(board);
  },
  noExtraColumn: function noExtraColumn(board) {
    const index = new Index(config.BOARD_COLUMNS, 0);
    return board.getItem(index) == undefined;
  },
  noExtraRow: function noExtraRow(board) {
    const index = new Index(0, config.BOARD_ROWS);
    return board.getItem(index) == undefined;
  },
  boardContents: function boardContents(board) {
    board.forEach(cell => {
      cell === config.IS_ALIVE || cell === config.IS_DEAD;
    });
    console.log('board contents ok');
  },
  live: function live(testConfig, board) {
    testConfig.generations++;
    console.group(`generation ${testConfig.generations}`);
    this.golRules(board);
    console.groupEnd();
  },
  golRules: function golRules(board) {
    board.forEach(cell => {
      if (cell.previous == config.IS_ALIVE) {
        this.fromAlive(cell);
      } else {
        this.fromDead(cell);
      }
    });
    console.log('Test GoL rules end');
  },
  fromAlive: function fromAlive(cell) {
    if (cell.state == config.IS_ALIVE) {
      this.keepAlive(cell);
    } else {
      this.kill(cell);
    }
  },
  keepAlive: function keepAlive(cell) {
    console.assert(cell.lifeAround <= config.OVER_POPULATION, {
      message: 'wasOkToKeepAlive',
      cell
    });
  },
  kill: function kill(cell) {
    console.assert(
      cell.lifeAround <= config.UNDER_POPULATION ||
        cell.lifeAround > config.OVER_POPULATION,
      {
        message: 'wasOKtoDieByWrongPopulation',
        cell
      }
    );
  },
  fromDead: function fromDead(cell) {
    if (cell.state == config.IS_ALIVE) {
      this.born(cell);
    } else {
      this.notBorn(cell);
    }
  },
  born: function born(cell) {
    if (this.isFirstGeneration(cell)) return;
    console.assert(cell.lifeAround === config.REPRODUCTION, {
      message: 'wasOkToHaveBorn',
      cell
    });
  },
  notBorn: function notBorn(cell) {
    if (this.isFirstGeneration(cell)) return;
    console.assert(cell.lifeAround < config.REPRODUCTION, {
      message: 'wasOkToNotBorn',
      cell
    });
  },
  isFirstGeneration: function isFirstGeneration(cell) {
    return cell.previous == null;
  }
};
