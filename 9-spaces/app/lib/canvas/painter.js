export class Painter {
  constructor(gameConfig, canvasConfig) {
    this._gameConfig = gameConfig;
    this._canvasConfig = canvasConfig;
    const CANVAS_ID = "gameCanvas";
    this._canvas = document.getElementById(CANVAS_ID);
    this._setUpCanvasContext();
  }

  _getCanvas(canvasId) {
    return document.getElementById(canvasId);
  }
  _setUpCanvasContext() {
    const canvasSize = this._calculateCanvasSize(
      this._gameConfig.COLUMNS,
      this._gameConfig.ROWS,
      this._canvasConfig.SQUARE_PXS
    );
    this._setSizeOfCanvas(canvasSize);
    this._setCanvasClearContext(canvasSize);
  }
  _calculateCanvasSize(columns, rows, squarePixels) {
    const width = columns * squarePixels;
    const height = rows * squarePixels;
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
    board.forEach(this._fillSquare.bind(this));
  }
  _fillSquare(item) {
    this._fillState(item.index, this._getColor(item));
  }
  _getColor(item) {
    let color = this._canvasConfig.DEAD_COLOR;
    if (this._isAlive(item)) {
      color = this._canvasConfig.ALIVE_COLOR;
    }
    return color;
  }
  _isAlive(item) {
    return item.state == this._gameConfig.IS_ALIVE;
  }
  _fillState(index, color) {
    this._context.fillStyle = color;
    const length = this._canvasConfig.SQUARE_PXS;
    const left = index.column * length;
    const top = index.row * length;
    this._context.fillRect(left, top, length, length);
  }
}
