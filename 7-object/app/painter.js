import { GAME } from "../config/game.js";
import { CANVAS } from "../config/canvas.js";
export class Painter {
  constructor() {
    this.boardCanvas = document.getElementById("gameCanvas");
    this.canvasContext = this.boardCanvas.getContext("2d");
    this.setUpCanvas();
  }

  drawBoardOnCanvas(board) {
    this.clearCanvas();
    board.forEach(this.fillCell.bind(this));
  }
  setUpCanvas() {
    const CANVAS = this.boardCanvas;
    const PXS = CANVAS.CELL_SQUARE_PXS;
    CANVAS.width = GAME.BOARD_COLUMNS * PXS;
    CANVAS.height = GAME.BOARD_ROWS * PXS;
    CANVAS.style.width = CANVAS.width;
    CANVAS.style.height = CANVAS.height;
  }
  clearCanvas() {
    const CONTEXT = this.canvasContext;
    const CANVAS = this.boardCanvas;
    CONTEXT.fillStyle = CANVAS.DEAD_COLOR;
    CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);
  }
  fillCell(cell, index) {
    if (cell.status.current === GAME.ALIVE) {
      this.fillLivingCell(index.column, index.row);
    }
  }
  fillLivingCell(column, row) {
    const CONTEXT = this.canvasContext;
    const PXS = CANVAS.CELL_SQUARE_PXS;
    CONTEXT.fillStyle = CANVAS.ALIVE_COLOR;
    CONTEXT.fillRect(column * PXS, row * PXS, PXS, PXS);
  }
}
