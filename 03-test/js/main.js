var paper = Snap("#svgContainer");

var paperWidth = parseInt(document.getElementById("svgContainer").getAttribute("width"));
var paperHeight = parseInt(document.getElementById("svgContainer").getAttribute("height"));

init();

function init() {
  draw();
}

function draw() {
  // drawFifaViz();
  underscoreTest();
}

function underscoreTest() {

}

function drawFifaViz() {

  var armingCounted = [20, 32, 14, 18, 10];

  // empty array to push new position coords for the polygon
  var positions = [];

  for (var i = 0; i < armingCounted.length; i++) {
    var size = 5;
    var angle = (360 / armingCounted.length * i) - 90;
    angle = radians(angle);

    //indicator for the visualisation is set on the maximum
    var maxValue = Math.max(...armingCounted);
    var indicatorX = (paperWidth / 2) + Math.cos(angle) * size * maxValue * 1.2;
    var indicatorY = (paperHeight / 2) + Math.sin(angle) * size * maxValue * 1.2;

    //calculate anchor points on a circle for the polygon
    var xPos = (paperWidth / 2) + Math.cos(angle) * size * armingCounted[i];
    var yPos = (paperHeight / 2) + Math.sin(angle) * size * armingCounted[i];
    // pushes the coords in the positions array
    positions.push(Math.round(xPos), Math.round(yPos));

    paper.ellipse(indicatorX, indicatorY, 2, 2).attr({
      fill: "black"
    });
  }
  paper.polygon([positions[0], positions[1],
    positions[2], positions[3],
    positions[4], positions[5],
    positions[6], positions[7],
    positions[8], positions[9]
  ]).attr({
    fill: "black"
  });
}