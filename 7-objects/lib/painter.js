import { CANVAS } from "../config/canvas.js";
import { GAME } from "../config/game.js";
export class Painter {
  constructor() {
    this.boardCanvas = document.getElementById(
      CANVAS.ELEMENT_ID
    );
    this.canvasContext = this.boardCanvas.getContext(
      CANVAS.CONTEXT
    );
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
    context.fillRect(
      CANVAS.INIT_WIDTH,
      CANVAS.INIT_HEIGHT,
      canvas.width,
      canvas.height
    );
  }
  fillCell(cell, index) {
    if (cell.status.current === GAME.IS_ALIVE) {
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
