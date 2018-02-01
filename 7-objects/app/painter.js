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
    const canvas = this.boardCanvas;
    const PXS = CANVAS.CELL_SQUARE_PXS;
    canvas.width = GAME.BOARD_COLUMNS * PXS;
    canvas.height = GAME.BOARD_ROWS * PXS;
    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;
  }
  clearCanvas() {
    const context = this.canvasContext;
    const canvas = this.boardCanvas;
    context.fillStyle = CANVAS.DEAD_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  fillCell(cell, index) {
    if (cell.status.current === GAME.ALIVE) {
      this.fillLivingCell(index.column, index.row);
    }
  }
  fillLivingCell(column, row) {
    const context = this.canvasContext;
    const PXS = CANVAS.CELL_SQUARE_PXS;
    context.fillStyle = CANVAS.ALIVE_COLOR;
    context.fillRect(column * PXS, row * PXS, PXS, PXS);
  }
}
