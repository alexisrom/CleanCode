import { Counter } from "./counter.js";
import { Judge } from "./judge.js";
import { Executor } from "./executor.js";

export class Generator {
  constructor(board, config) {
    this._board = board;
    this._config = config;
    this._counter = new Counter(board, config);
    this._judge = new Judge(config);
    this._executor = new Executor(config);
  }

  initializeState(cell) {
    if (this._judge.canBeAlive()) {
      this._executor.setCellAlive(cell);
    } else {
      this._executor.setCellDead(cell);
    }
    return cell;
  }

  generateNextState(cell) {
    this._setLifeAroundCell(cell);
    if (this._cellIsDead(cell)) {
      this._generateForDeadCell(cell);
    } else {
      this._generateForAliveCell(cell);
    }
    return cell;
  }
  _setLifeAroundCell(cell) {
    cell.lifeAround = this._counter.countLifeAround(cell);
    return cell;
  }
  _cellIsDead(cell) {
    return cell.state == this._config.IS_DEAD;
  }
  _generateForDeadCell(cell) {
    if (this._judge.cellMustBorn(cell)) {
      this._executor.setCellAlive(cell);
    }
  }
  _generateForAliveCell(cell) {
    if (this._judge.cellMustDie(cell)) {
      this._executor.setCellDead(cell);
    } else {
      this._executor.setCellAlive(cell);
    }
  }
}
