import { Board, Cell, Index } from "./data.js";
import { Canvas } from "./canvas.js";

export class Game {
  constructor(gameConfig, canvasConfig) {
    this._gameConfig = gameConfig;
    this._canvasConfig = canvasConfig;
    this._board = new Board(
      this._gameConfig.COLUMNS,
      this._gameConfig.ROWS,
      this._creator
    );
    this._initialize();
  }

  get board() {
    return this._board;
  }
  set board(value) {
    this._board = value;
  }

  _creator(index) {
    return new Cell(index, null, null, 0, 0);
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
    return randomLifeProbability > this._gameConfig.LIFE_PROBABILITY;
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
    return cell.state == this._gameConfig.IS_DEAD;
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
    cell.state = this._gameConfig.IS_DEAD;
  }
  _setCellAlive(cell) {
    cell.state = this._gameConfig.IS_ALIVE;
  }
  _cellMustBorn(cell) {
    return cell.lifeAround == this._gameConfig.REPRODUCTION;
  }
  _cellMustDie(cell) {
    return this._isAlone(cell) || this._isFull(cell);
  }
  _isAlone(cell) {
    return cell.lifeAround < this._gameConfig.UNDER_POPULATION;
  }
  _isFull(cell) {
    return cell.lifeAround > this._gameConfig.OVER_POPULATION;
  }

  _drawBoardOnCanvas() {
    const canvas = new Canvas(this._gameConfig, this._canvasConfig);
    canvas.fillCanvasWithBoard(this._board);
  }

  _countLifeAround(cell) {
    let liveAround = 0;
    const cellColumn = cell.index.column;
    const cellRow = cell.index.row;
    const leftColumn = cellColumn - 1;
    const rightColumn = cellColumn + 1;
    const topRow = cellRow - 1;
    const bottomRow = cellRow + 1;
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
      return cell.state == this._gameConfig.IS_ALIVE;
    } else {
      return false;
    }
  }
}
