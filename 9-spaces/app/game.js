import { Board } from "../database/board.js";
import { Cell } from "../database/cell.js";
import { Painter } from "./lib/canvas/painter.js";
import { Generator } from "./lib/life/generator.js";

export class Game {
  constructor(config, canvasConfig) {
    this._config = config;
    this._board = new Board(config.COLUMNS, config.ROWS);
    this._generator = new Generator(this._board, config);
    this._painter = new Painter(config, canvasConfig);
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
  _initializeCell(item) {
    const newCell = new Cell(null, null, item.index, 0, 0);
    return this._generator.initializeState(newCell);
  }

  live() {
    this._calculateNewGeneration();
    this._drawBoardOnCanvas();
  }
  _calculateNewGeneration() {
    this._board.map(this._generateNextState.bind(this));
  }
  _generateNextState(cell) {
    return this._generator.generateNextState(cell);
  }

  _drawBoardOnCanvas() {
    this._painter.fillCanvasWithBoard(this._board);
  }
}
