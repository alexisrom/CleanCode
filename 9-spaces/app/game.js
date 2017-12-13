import { Board } from "./database/board.js";
import { Cell } from "./database/cell.js";
import { Item } from "./database/item.js";
import { Painter } from "./lib/canvas/painter.js";
import { Generator } from "./lib/life/generator.js";
import { Counter } from "./lib/life/counter.js";
import { Judge } from "./lib/life/judge.js";
import { Executor } from "./lib/life/executor.js";

export class Game {
  constructor(gameConfig, canvasConfig) {
    this._gameConfig = gameConfig;
    this._canvasConfig = canvasConfig;
    this._board = new Board(
      this._gameConfig.COLUMNS,
      this._gameConfig.ROWS,
      this._creator
    );
    this._counter = new Counter(this._gameConfig, this._board);
    this._judge = new Judge(this._gameConfig);
    this._executor = new Executor(this._gameConfig);
    this._generator = new Generator(
      this._gameConfig,
      this._board,
      this._counter,
      this._judge,
      this._executor
    );
    this._painter = new Painter(this._gameConfig, this._canvasConfig);
    this._initialize();
  }

  get board() {
    return this._board;
  }
  set board(value) {
    this._board = value;
  }

  _creator(index) {
    return new Item(index);
  }
  _initialize() {
    this._board.map(this._initializeCell.bind(this));
  }
  _initializeCell(item) {
    const newCell = new Cell(item.index, null, null, 0, 0);
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
