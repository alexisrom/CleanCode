// canvas and grid size defaults
var grid = [];
var gridNext = [];
var gridWidth = 140;
var gridHeight = 70;
var gridSquareWidth = 10;

// create default grid array
// sudo random noise
for (var x = 0; x < gridWidth; x++) {
  grid[x] = [];
  gridNext[x] = [];
  for (var y = 0; y < gridHeight; y++) {
    grid[x][y] = 0;
    gridNext[x][y] = 0;
    var rand = Math.random() * 100;
    if (rand > 44) {
      grid[x][y] = 1;
    }
  }
}
// life init grid
function life() {
  // touch each grid coord
  for (var x = 0; x < gridWidth; x++) {
    for (var y = 0; y < gridHeight; y++) {
      // counts alive or dead for neighbours
      var count = countNearby(x, y, grid);
      if (grid[x][y] == 0) {
        if (count == 3) {
          gridNext[x][y] = 1;
        } else {
          gridNext[x][y] = 0;
        }
      } else {
        if (count < 2 || count > 3) {
          gridNext[x][y] = 0;
        } else {
          gridNext[x][y] = 1;
        }
      }
    }
  }
  // replace old grid with new population grid
  cloneGrid(grid, gridNext);
  function cloneGrid(newGrid, currentGrid) {
    for (var x = 0; x < gridWidth; x++) {
      for (var y = 0; y < gridHeight; y++) {
        newGrid[x][y] = currentGrid[x][y];
      }
    }
  }
}
// count grid neighbors
function countNearby(x, y) {
  var count = 0;
  // count all nearby squares
  counter(x - 1, y - 1);
  counter(x - 1, y);
  counter(x - 1, y + 1);
  counter(x, y - 1);
  counter(x, y + 1);
  counter(x + 1, y - 1);
  counter(x + 1, y);
  counter(x + 1, y + 1);
  function counter(x, y) {
    // if x and y on the grid
    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
      if (grid[x][y] == 1) count++;
    }
  }
  // return count value
  return count;
}
// game update
function update(dt) {
  // iterate simulation rules
  life();
  // draw result
  draw();
}
function draw() {
  // setup canvas
  var canvas = document.getElementById("gameCanvas");
  var ctx = canvas.getContext("2d");
  canvas.width = gridWidth * gridSquareWidth;
  canvas.height = gridHeight * gridSquareWidth;
  canvas.style.width = canvas.width;
  canvas.style.height = canvas.height;
  // clear canvas
  // console.table(grid);
  ctx.fillStyle = "#fee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (var x = 0; x < gridWidth; x++) {
    for (var y = 0; y < gridHeight; y++) {
      if (grid[x][y] == 1) {
        ctx.fillStyle = "#ee66aa";
        ctx.fillRect(
          x * gridSquareWidth,
          y * gridSquareWidth,
          gridSquareWidth,
          gridSquareWidth
        );
      }
    }
  }
}
// The main game loop
var lastTime;
function gameLoop() {
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;
  update(dt);
  lastTime = now;
  window.setTimeout(gameLoop, 50);
}
// start game
// gameLoop();

// FOR TESTING PURPOSES
export const game = {
  countNearby,
  draw,
  gameLoop,
  grid,
  gridHeight,
  gridNext,
  gridWidth,
  life
};
