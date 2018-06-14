var paper = Snap("#svgContainer");

var paperWidth = parseInt(document.getElementById("svgContainer").getAttribute("width"));
var paperHeight = parseInt(document.getElementById("svgContainer").getAttribute("height"));

init();

function init() {
  var testArray = [20, 30, 10, 15, 25];
  //console.log(data);
  // victimsPerState();
  //drawFifaViz(testArray);
  drawEthnicity(testArray);
}

function drawEthnicity(array) {
  var raceCounted = array;
  var angles = [];

  for (var i = 0; i < raceCounted.length; i++) {

    var reducer = (accumulator, currentValue) => accumulator + currentValue;
    var sumArray = raceCounted.reduce(reducer);
    console.log(raceCounted[i], "von", sumArray);

    var angle = map(raceCounted[i], 0, sumArray, 0, 360);
    console.log("Grad:", angle);

    //angle = radians(angle);
    //console.log("Bogenmaß:", angle);

    angles.push(angle);
  }
  console.log(angles);
  var angle1 = 90;
  var angle2 = 45;
  var angle3 = 160;

  var radian1 = radians(angle1);
  var radian2 = radians(angle1 + angle2);
  var radian3 = radians(angle1 + angle2 + angle3)

  var radius = 100;
  var centerX = paperWidth / 2;
  var centerY = paperHeight / 2;

  var startX = Math.sin(0) * radius + centerX;
  var startY = -Math.cos(0) * radius + centerY;

  var endX = Math.sin(radian1) * radius + centerX;
  var endY = -Math.cos(radian1) * radius + centerY;

  var endX2 = Math.sin(radian2) * radius + centerX;
  var endY2 = -Math.cos(radian2) * radius + centerY;

  var endX3 = Math.sin(radian3) * radius + centerX;
  var endY3 = -Math.cos(radian3) * radius + centerY;

  paper.path("M" + startX + "," + startY + "A" + radius + "," + radius + " 0 0 1 " + endX + "," + endY + "").attr({
    stroke: "yellow",
    strokeWidth: 10
  })

  paper.path("M" + endX + "," + endY + "A" + radius + "," + radius + " 0 0 1 " + endX2 + "," + endY2 + "").attr({
    stroke: "green",
    strokeWidth: 10
  })

  paper.path("M" + endX2 + "," + endY2 + "A" + radius + "," + radius + " 0 0 1 " + endX3 + "," + endY3 + "").attr({
    stroke: "pink",
    strokeWidth: 10
  })


}

function drawFifaViz(array) {

  var armingCounted = array;

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
      fill: "white"
    });
  }
  paper.polygon(positions).attr({
    fill: "white"
  });
}

function victimsPerState() {
  console.log(data)

  for (var i = 0; i < 51; i++) {

    var xPos = (i * paperWidth / 51);
    var yPos = (paperHeight - data[i].age) - (paperHeight / 2);
    var age = data[i].age

    paper.rect(xPos, yPos, 2, age).attr({
      fill: 'white'
    });
  }

  var mergedData = {};
  for (var i = 0; i < data.length; i++) {
    var newData = data[i];

    var merged = mergedData[newData.state];
    if (!merged) {
      merged = [];
      mergedData[newData.state] = merged;
    }
    merged.push(newData.state);
  }

  console.log(mergedData, "AK", mergedData.AK.length, "CA", mergedData.CA.length);




  // counter but just for array no objects
  //
  // var array1 = ['a', 'b', 'c', 'a', 'b', 'c', 'a'];
  // counter = {}
  // array1.forEach(function(obj) {
  //   var key = JSON.stringify(obj)
  //   counter[key] = (counter[key] || 0) + 1
  // })
  // console.log(counter);
}