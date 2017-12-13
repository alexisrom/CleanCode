export class Canvas {
  constructor(gameConfig, canvasConfig) {
    this._gameConfig = gameConfig;
    this._canvasConfig = canvasConfig;
    this._canvas = document.getElementById(this._canvasConfig.CANVAS_ID);
    this._setUpCanvasContext();
  }

  _setUpCanvasContext() {
    const canvasSize = this._calculateCanvasSize(
      this._gameConfig.COLUMNS,
      this._gameConfig.ROWS,
      this._canvasConfig.CELL_SQUARE_PXS
    );
    this._setSizeOfCanvas(canvasSize);
    this._setCanvasClearContext(canvasSize);
  }
  _calculateCanvasSize(columns, rows, cellSquarePixels) {
    const width = columns * cellSquarePixels;
    const height = rows * cellSquarePixels;
    return { width, height };
  }
  _setSizeOfCanvas(canvasSize) {
    this._canvas.width = canvasSize.width;
    this._canvas.height = canvasSize.height;
    this._canvas.style.width = canvasSize.width;
    this._canvas.style.height = canvasSize.height;
  }
  _setCanvasClearContext(size) {
    this._context = this._canvas.getContext("2d");
    this._context.fillStyle = this._canvasConfig.DEAD_COLOR;
    this._context.fillRect(0, 0, size.width, size.height);
  }

  fillCanvasWithBoard(board) {
    board.forEach(this._fillCell.bind(this));
  }
  _fillCell(cell) {
    if (this._cellIsAlive(cell)) {
      this._fillCellState(cell.index, this._canvasConfig.ALIVE_COLOR);
    }
  }
  _cellIsAlive(cell) {
    return cell.state == this._gameConfig.IS_ALIVE;
  }
  _fillCellState(index, color) {
    this._context.fillStyle = color;
    const length = this._canvasConfig.CELL_SQUARE_PXS;
    const left = index.column * length;
    const top = index.row * length;
    this._context.fillRect(left, top, length, length);
  }
}
