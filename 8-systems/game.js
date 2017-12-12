import { Config } from "./config.js";
import { Board, Index } from "./data.js";
import { Canvas } from "./canvas.js";
let config = new Config();

export class Game {
  constructor() {
    this._board = new Board(config.COLUMNS, config.ROWS);
    this._initialize();
  }

  get board() {
    return this._board;
  }
  set board(value) {
    this._board = value;
  }

  _initialize() {
    this._board.map(this._initializeCell.bind(this));
  }
  _initializeCell(cell) {
    if (this._canBeAlive()) {
      this._setCellAlive(cell);
    } else {
      this._setCellDead(cell);
    }
    return cell;
  }
  _canBeAlive() {
    const randomLifeProbability = Math.random();
    return randomLifeProbability > config.LIFE_PROBABILITY;
  }

  live() {
    this._calculateNewGeneration();
    this._drawBoardOnCanvas();
  }
  _calculateNewGeneration() {
    this._board.map(this._setLifeAroundCell.bind(this));
    this._board.map(this._generateNextCell.bind(this));
  }
  _setLifeAroundCell(cell) {
    cell.lifeAround = this._countLifeAround(cell);
    return cell;
  }
  _generateNextCell(cell) {
    if (this._cellIsDead(cell)) {
      this._generateForDeadCell(cell);
    } else {
      this._generateForAliveCell(cell);
    }
    return cell;
  }
  _cellIsDead(cell) {
    return cell.state == config.IS_DEAD;
  }
  _generateForDeadCell(cell) {
    if (this._cellMustBorn(cell)) {
      this._setCellAlive(cell);
    }
  }
  _generateForAliveCell(cell) {
    if (this._cellMustDie(cell)) {
      this._setCellDead(cell);
    } else {
      this._setCellAlive(cell);
    }
  }

  _setCellDead(cell) {
    cell.state = config.IS_DEAD;
  }
  _setCellAlive(cell) {
    cell.state = config.IS_ALIVE;
  }
  _cellMustBorn(cell) {
    return cell.lifeAround == config.REPRODUCTION;
  }
  _cellMustDie(cell) {
    return this._isAlone(cell) || this._isFull(cell);
  }
  _isAlone(cell) {
    return cell.lifeAround < config.UNDER_POPULATION;
  }
  _isFull(cell) {
    return cell.lifeAround > config.OVER_POPULATION;
  }

  _drawBoardOnCanvas() {
    const canvas = new Canvas(config);
    canvas.fillCanvasWithBoard(this._board);
  }

  _countLifeAround(cell) {
    var liveAround = 0;
    var cellColumn = cell.index.column;
    var cellRow = cell.index.row;
    var leftColumn = cellColumn - 1;
    var rightColumn = cellColumn + 1;
    var topRow = cellRow - 1;
    var bottomRow = cellRow + 1;
    liveAround += this._countIfAlive(leftColumn, topRow);
    liveAround += this._countIfAlive(leftColumn, cellRow);
    liveAround += this._countIfAlive(leftColumn, bottomRow);
    liveAround += this._countIfAlive(cellColumn, topRow);
    liveAround += this._countIfAlive(cellColumn, bottomRow);
    liveAround += this._countIfAlive(rightColumn, topRow);
    liveAround += this._countIfAlive(rightColumn, cellRow);
    liveAround += this._countIfAlive(rightColumn, bottomRow);
    return liveAround;
  }
  _countIfAlive(column, row) {
    const index = new Index(column, row);
    const cell = this._board.getItem(index);
    return this._cellIsAlive(cell);
  }
  _cellIsAlive(cell) {
    if (cell) {
      return cell.state == config.IS_ALIVE;
    } else {
      return false;
    }
  }
}
