import { Board } from "../database/board.js";
import { CanvasPainter } from "./lib/canvas_painter.js";
import { LifeGenerator } from "./lib/life_generator.js";
import { LifeCounter } from "./lib/life_counter.js";

export class Game {
  constructor(config, canvasConfig) {
    this._config = config;
    this._canvasConfig = canvasConfig;
    this._board = new Board(config.COLUMNS, config.ROWS);
    this._lifeGenerator = new LifeGenerator(this._board, config);
    this._lifeCounter = new LifeCounter(this._board, config);
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
    return this._lifeGenerator.initializeState(cell);
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
    cell.lifeAround = this._lifeCounter.countLifeAround(cell);
    return cell;
  }
  _generateNextCell(cell) {
    return this._lifeGenerator.generateNextState(cell);
  }

  _drawBoardOnCanvas() {
    const canvasPainter = new CanvasPainter(this._config, this._canvasConfig);
    canvasPainter.fillCanvasWithBoard(this._board);
  }
}
