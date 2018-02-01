import { CANVAS } from "../config/canvas.js";
export class Painter {
  constructor(game) {
    this.game = game;
    this.boardCanvas = document.getElementById("gameCanvas");
    this.canvasContext = this.boardCanvas.getContext("2d");
    this._setUpCanvas();
  }

  drawBoard(board) {
    this._clearCanvas();
    board.forEach(this._fillCell.bind(this));
  }
  _setUpCanvas() {
    const canvas = this.boardCanvas;
    const PXS = CANVAS.CELL_SQUARE_PXS;
    canvas.width = this.game.BOARD_COLUMNS * PXS;
    canvas.height = this.game.BOARD_ROWS * PXS;
    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;
  }
  _clearCanvas() {
    const context = this.canvasContext;
    const canvas = this.boardCanvas;
    context.fillStyle = CANVAS.DEAD_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  _fillCell(cell, index) {
    if (cell.status.current === this.game.ALIVE) {
      this._fillLivingCell(index.column, index.row);
    }
  }
  _fillLivingCell(column, row) {
    const context = this.canvasContext;
    const PXS = CANVAS.CELL_SQUARE_PXS;
    context.fillStyle = CANVAS.ALIVE_COLOR;
    context.fillRect(column * PXS, row * PXS, PXS, PXS);
  }
}
