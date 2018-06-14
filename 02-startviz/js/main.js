var paper = Snap("#svgContainer");

var paperWidth = parseInt(document.getElementById("svgContainer").getAttribute("width"));
var paperHeight = parseInt(document.getElementById("svgContainer").getAttribute("height"));

var cx = paperWidth / 2;
var cy = paperHeight / 2;

init();

function init() {
  var testArray = [10, 20, 15, 5, 30];

  //console.log(data);
  //victimsPerState();
  // drawFifaViz(testArray);
  // drawEthnicity(testArray);
  drawSmartDonut(testArray);
  //drawEthnicity2(testArray);

}


function drawEthnicity2(array) {
  var raceCounted = array;
  var angles = [];
  var radius = 150;


  for (var i = 0; i < raceCounted.length; i++) {

    var reducer = (accumulator, currentValue) => accumulator + currentValue;
    var sumArray = raceCounted.reduce(reducer);
    console.log(raceCounted[i], "von", sumArray);

    var angle = map(raceCounted[i], 0, sumArray, 0, 360);
    console.log("Grad:", angle);

    angles.push(angle);
  }
  console.log(angles);
  var spacing = 3;
  console.log(angles[0] + spacing)

  document.getElementById("arc1").setAttribute("d", describeArc(cx, cy, radius, 0 + spacing, angles[0]));
  document.getElementById("arc2").setAttribute("d", describeArc(cx, cy, radius, angles[0], angles[0] + angles[1]));
  document.getElementById("arc3").setAttribute("d", describeArc(cx, cy, radius, angles[0] + angles[1], angles[0] + angles[1] + angles[2]));
  document.getElementById("arc4").setAttribute("d", describeArc(cx, cy, radius, angles[0] + angles[1] + angles[2], angles[0] + angles[1] + angles[2] + angles[3]));
  document.getElementById("arc5").setAttribute("d", describeArc(cx, cy, radius, angles[0] + angles[1] + angles[2] + angles[3], angles[0] + angles[1] + angles[2] + angles[3] + angles[4]));

};

function drawSmartDonut(array) {

  var raceCounted = array;


  var radiusVizualization = 100;
  var offsetX = paperWidth / 2;
  var offsetY = paperHeight / 2;

  var radiants = [];

  var reducer = (accumulator, currentValue) => accumulator + currentValue;
  var sumArray = raceCounted.reduce(reducer);

  for (var i = 0; i < raceCounted.length; i++) {
    var angle = map(raceCounted[i], 0, sumArray, 0, 360);
    rad = radians(angle);

    radiants.push(rad);
  }

  var positions = [];
  var currentPosition = 0; // for the following loop

  for (var i = 0; i < radiants.length; i++) {
    positions.push([]);
    var start = currentPosition;
    var end = currentPosition + radiants[i];

    positions[i].push(start);
    positions[i].push(end);
    currentPosition += radiants[i];
  }

  for (var i = 0; i < radiants.length; i++) {
    for (var j = 0; j < positions[i].length; j++) {
      var radianArcStart = positions[i][0];
      var radianArcEnd = positions[i][1];

      var above180 = 0;
      if (radiants[i] > radians(180)) {
        above180 = 1;
      }

      var startX = Math.sin(radianArcStart) * radiusVizualization + offsetX;
      var startY = -Math.cos(radianArcStart) * radiusVizualization + offsetY;

      var endX = Math.sin(radianArcEnd) * radiusVizualization + offsetX;
      var endY = -Math.cos(radianArcEnd) * radiusVizualization + offsetY;

      paper.path("M" + startX + "," + startY + "A" + radiusVizualization + "," + radiusVizualization + " 0 " + above180 + " 1 " + endX + "," + endY + "").attr({
        stroke: getColor(i * 20),
        strokeWidth: 15,
        fill: "none"
      })
    }
  }
}


function drawEthnicity(array) {
  var raceCounted = array;
  var angles = [];

  for (var i = 0; i < raceCounted.length; i++) {

    var reducer = (accumulator, currentValue) => accumulator + currentValue;
    var sumArray = raceCounted.reduce(reducer);
    //  console.log(raceCounted[i], "von", sumArray);

    var angle = map(raceCounted[i], 0, sumArray, 0, 360);
    //  console.log("Grad:", angle);

    //angle = radians(angle);
    //console.log("Bogenmaß:", angle);

    angles.push(angle);
  }


  console.log(angles);
  var angle1 = angles[0];
  var angle2 = angles[1];
  var angle3 = angles[2];
  var angle4 = angles[3];
  var angle5 = angles[4];


  var radian1 = radians(angle1);
  var radian2 = radians(angle1 + angle2);
  var radian3 = radians(angle1 + angle2 + angle3);
  var radian4 = radians(angle1 + angle2 + angle3 + angle4);
  var radian5 = radians(angle1 + angle2 + angle3 + angle4 + angle5);

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

  var endX4 = Math.sin(radian4) * radius + centerX;
  var endY4 = -Math.cos(radian4) * radius + centerY;

  var endX5 = Math.sin(radian5) * radius + centerX;
  var endY5 = -Math.cos(radian5) * radius + centerY;

  var above180 = 0;
  if (radian1 > radians(180)) {
    above180 = 0;
  }
  paper.path("M" + startX + "," + startY + "A" + radius + "," + radius + " 0 " + above180 + " 1 " + endX + "," + endY + "").attr({
    stroke: getColor(20),
    strokeWidth: 15
  })

  paper.path("M" + endX + "," + endY + "A" + radius + "," + radius + " 0 0 1 " + endX2 + "," + endY2 + "").attr({
    stroke: getColor(40),
    strokeWidth: 15
  })

  paper.path("M" + endX2 + "," + endY2 + "A" + radius + "," + radius + " 0 0 1 " + endX3 + "," + endY3 + "").attr({
    stroke: getColor(60),
    strokeWidth: 15
  })

  paper.path("M" + endX3 + "," + endY3 + "A" + radius + "," + radius + " 0 0 1 " + endX4 + "," + endY4 + "").attr({
    stroke: getColor(80),
    strokeWidth: 15
  })

  paper.path("M" + endX4 + "," + endY4 + "A" + radius + "," + radius + " 0 0 1 " + endX5 + "," + endY5 + "").attr({
    stroke: getColor(100),
    strokeWidth: 15
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



//helper functions
function getColor(inputVal) {
  var func = chroma.scale(["#fff", "#444"]).domain([0, 100]);
  return func(inputVal);
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {

  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");

  return d;
}