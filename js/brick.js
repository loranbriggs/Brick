// canvas
var canvas;
var ctx;

// window
var height;
var width;

// ball 
var x;
var y;
var dx = 2;
var dy = 4;

// paddle
var paddlex = 200;
var paddleh;
var paddlew;
var dpaddle;
var rightDown = false;
var leftDown = false;

// bricks
var bricks;
var nRows = 4;
var nCols = 5;
var brickWidth;
var brickHeight;
var xPadding;
var yPadding;

// game variables
var lives = 3;
var level = 0;

var ballColor = "rgb(0, 50, 0)";
var paddleColor = "rgb(0, 0, 50)";
var background = "rgb(0,0,0)";
var colors = ["#FF0000", "#FF7400", "#009999", "#00CC00"];

function init() {
	canvas = document.getElementById('gameCanvas');
	ctx = canvas.getContext('2d');

  levelUp();

	// resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();
  x = paddlex + paddlew / 2;
  y = height - paddleh;

  return setInterval(draw, 10);
}    

function levelUp() {
  level++;
  nRows++;
  bricks= new Array(nRows);
  for ( i = 0; i < nRows; i++) {
    bricks[i] = new Array(nCols);
    for ( j = 0; j < nCols; j++) {
      bricks[i][j] = 1;
    }
  }
}

function resizeCanvas()  {
  height = $(window).height();
  width  = $(window).width();

  paddleh = height*0.04;
  paddlew = width*0.25;
  dpaddle = width*0.005;

  xPadding = width*0.01;
  yPadding = height*0.01;
  brickWidth = (width / nCols) - xPadding;
  brickHeight = height*0.05;

  canvas.height = height;
  canvas.width  = width;
}

function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

function drawBricks() {
  for ( i = 0; i < nRows; i++) {
    for ( j = 0; j < nCols; j++) {
      ctx.fillStyle = colors[i%4];
      if (bricks[i][j] == 1) {
        rect( (j*(brickWidth + xPadding)) + xPadding,
              (i*(brickHeight + yPadding)) + yPadding,
              brickWidth, brickHeight );
      }
    }
  }
}

function hitBrick() {
  rowheight = brickHeight + yPadding;
  colwidth = brickWidth + xPadding;
  row = Math.floor(y/rowheight);
  col = Math.floor(x/colwidth);
  //if so, reverse the ball and mark the brick as broken
  if (y < nRows * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
    dy = -dy;
    bricks[row][col] = 0;
  }
}

// clears canvas
function clear() {
  ctx.clearRect(0, 0, width, height);
}

// controls the x position of ball
function xpos() {
  if (x + dx > width || x + dx < 0)
    dx = -dx;
  x += dx;
  return x;
}

// controls the y position of ball
function ypos() {
  if (y + dy < 0)
    dy = -dy;
  else if ( 
    (y + dy > (height - paddleh) ) &&
    (x + dx > paddlex ) &&
    (x + dx < (paddlex + paddlew) ) ) {
      dy = -dy;
      if ( (x < (paddlex + paddlew/2 + paddlew/12)) && 
           (x > (paddlex + paddlew/2 - paddlew/12 )))
        dx = dx*0.4;
      else if ( (x < (paddlex + paddlew/2 + paddlew/8)) && 
           (x > (paddlex + paddlew/2 - paddlew/8 )))
        dx = dx*0.8;
      else if ( (x < (paddlex + paddlew/2 + paddlew/4)) && 
           (x > (paddlex + paddlew/2 - paddlew/4 )))
        dx = dx*1.5;
      else
        dx = dx*3.0;
  }
  else if (y + dy > height)
    clearInterval(intervalId);
  y += dy;
  return y;
}

// controls the x position of paddle
function xpad() {
  if (rightDown) paddlex += dpaddle;
  else if (leftDown) paddlex -= dpaddle;
  return paddlex;
}

//set rightDown or leftDown if the right or left keys are down
function onKeyDown(evt) {
  if (evt.keyCode == 39) rightDown = true;
  else if (evt.keyCode == 37) leftDown = true;
}

//and unset them when the right or left key is released
function onKeyUp(evt) {
  if (evt.keyCode == 39) rightDown = false;
  else if (evt.keyCode == 37) leftDown = false;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

// mouse control
function onMouseMove(evt) {
  if (evt.pageX > 0 && evt.pageX < width) {
    paddlex = evt.pageX - (paddlew/2);
  }
}

$(document).mousemove(onMouseMove);

function draw() {
  clear();
  ctx.fillStyle = ballColor;
  circle(xpos(), ypos(), 10);
  ctx.fillStyle = paddleColor;
  rect(xpad(), height-paddleh, paddlew, paddleh)
  drawBricks();
  hitBrick();
  
}
