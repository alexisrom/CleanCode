import { GAME } from "../config/game.js";
import { CANVAS } from "../config/canvas.js";
export class Painter {
  constructor() {
    this.boardCanvas = document.getElementById("gameCanvas");
    this.canvasContext = this.boardCanvas.getContext("2d");
  }

  drawBoardOnCanvas(board) {
    this.setUpCanvas();
    board.forEach(this.fillCell.bind(this));
  }
  setUpCanvas() {
    const canvas = this.boardCanvas;
    canvas.width = GAME.BOARD_COLUMNS * CANVAS.CELL_SQUARE_PXS;
    canvas.height = GAME.BOARD_ROWS * CANVAS.CELL_SQUARE_PXS;
    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;
    this.clearCanvas();
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
    context.fillStyle = CANVAS.ALIVE_COLOR;
    context.fillRect(
      column * CANVAS.CELL_SQUARE_PXS,
      row * CANVAS.CELL_SQUARE_PXS,
      CANVAS.CELL_SQUARE_PXS,
      CANVAS.CELL_SQUARE_PXS
    );
  }
}
