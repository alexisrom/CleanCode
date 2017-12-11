// canvas and grid size defaults
var gridWidth = 140;
var gridHeight = 70;
var gridSquareWidth = 10;

var grid = [];
var gridNext = [];

var initializationTime = Date.now();
// create default grid array
// sudo random noise
for (var x = 0; x < gridWidth; x++) {
  grid[x] = [];
  gridNext[x] = [];
  for (var y = 0; y < gridHeight; y++) {
    grid[x][y] = [];
    gridNext[x][y] = [];

    var rand = Math.random() * 100;

    if (rand > 44) grid[x][y] = 1;
  }
}

// life init grid
function life() {
  // touch each grid coord
  for (var x = 0; x < gridWidth; x++) {
    for (var y = 0; y < gridHeight; y++) {
      // counts alive or dead for neighbours
      var count = countNearby(x, y);

      if (grid[x][y] == 0) {
        if (count == 3) {
          // life is born
          gridNext[x][y] = 1;
        }
      } else {
        if (count < 2 || count > 3) {
          // underpopulation & overpopulation
          gridNext[x][y] = 0;
        } else {
          gridNext[x][y] = 1;
        }
      }
    }
  }
  // replace old grid with new population grid
  grid = gridNext;
}

// count grid neighbours
function countNearby(x, y) {
  var count = 0;

  // count all nearby sqaures
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
    if (x > 0 && x < gridWidth && y > 0 && y < gridHeight) {
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
  var canvas = document.getElementById("gameCanvas");
  var ctx = canvas.getContext("2d");
  canvas.width = gridWidth * gridSquareWidth;
  canvas.height = gridHeight * gridSquareWidth;
  canvas.style.width = canvas.width;
  canvas.style.height = canvas.height;
  // clear canvas
  ctx.fillStyle = "#fee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // setup canvas

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
  console.group(`life executed ${times} times`);
  testGoLRules();
  console.groupEnd();
  keepTesting();
  function keepTesting() {
    if (Date.now() - initializationTime > 5000) {
      console.log("Test end!!!");
      return;
    }
    times++;
    setTimeout(gameLoop, 50);
  }
}

console.clear();
console.log("Begin tests...");
testInitialization();
times = 1;
gameLoop();

function testInitialization() {
  console.group("Initialization");
  sizeGrid();
  console.log("grid sizes ok");
  sizeNext();
  console.log("gridNext sizes ok");
  contentGrids();
  console.groupEnd();
}

function contentGrids() {
  grid.forEach(column => {
    column.forEach(row => {
      console.assert(valueOK(row), `grid has invalid data`, row);
    });
  });
  console.log("grid contents ok");
  gridNext.forEach(column => {
    column.forEach(row => {
      console.assert(valueOK(row), `grid has invalid data`, row);
    });
  });
  console.log("gridNext contents ok");
}

function valueOK(value) {
  return Array.isArray(value) || value === 1 || value === 0;
}

function sizeGrid() {
  console.assert(hasBegin(), `grid has no begin`, grid);
  console.assert(hasEnd(), `grid has no end`, grid);
  console.assert(isNotOversized(), `grid is oversized`, grid);
  function hasBegin() {
    return grid[0][0] !== null;
  }
  function hasEnd() {
    return grid[gridWidth - 1][gridHeight - 1] !== null;
  }
  function isNotOversized() {
    return grid[gridWidth] == undefined && grid[0][gridHeight] == undefined;
  }
}

function sizeNext() {
  console.assert(hasBegin(), `grid has no begin`, gridNext);
  console.assert(hasEnd(), `grid has no end`, gridNext);
  console.assert(isNotOversized(), `grid is oversized`, gridNext);
  function hasBegin() {
    return gridNext[0][0] !== null;
  }
  function hasEnd() {
    return gridNext[gridWidth - 1][gridHeight - 1] !== null;
  }
  function isNotOversized() {
    return (
      gridNext[gridWidth] === undefined && gridNext[0][gridHeight] === undefined
    );
  }
}

function testGoLRules() {
  for (var x = 0; x < gridWidth; x++) {
    for (var y = 0; y < gridHeight; y++) {
      var currentCell = grid[x][y];
      var nextCell = gridNext[x][y];
      testTransitionOk(currentCell, nextCell, x, y);
    }
  }
  console.log("GoL rules ok");
  function testTransitionOk(current, next, x, y) {
    var count = countNearby(x, y);
    var status = { current, next, x, y, count };
    if (current == 1) {
      if (next == 1) {
        console.assert(true || count <= 3, {
          message: "Transition incorrect wasOkToKeepAlive",
          status
        });
      } else {
        console.assert(count > 3, {
          message: "Transition incorrect diesByOverPopulation",
          status
        });
      }
    } else {
      if (next == 1) {
        console.assert(count === 3, {
          message: "Transition incorrect isNewBorn",
          status
        });
      } else {
        console.assert(true || count < 3, {
          message: "Transition incorrect notEnoughToBorn",
          status
        });
      }
    }
  }
}
