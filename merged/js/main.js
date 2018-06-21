var paper = Snap("#svgContainer");

var paperWidth = parseInt(document.getElementById("svgContainer").getAttribute("width"));
var paperHeight = parseInt(document.getElementById("svgContainer").getAttribute("height"));

var cx = paperWidth / 2;
var cy = paperHeight / 2;

init();

function init() {

  var testArray = [];
  var sortedState = _.groupBy(data, 'state').FL;

  var armingAttributes = ['neutral', 'dangerous', 'harmful', 'harmless', 'unarmed'];

  for (var i = 0; i < armingAttributes.length; i++) {
    // console.log(_.groupBy(sortedState, 'arming')[armingAttributes[i]].length, armingAttributes[i]);
    countedArming = _.groupBy(sortedState, 'arming')[armingAttributes[i]].length
    testArray.push(countedArming);
    // console.log(countedArming, testArray);
  }
  // underscoreTest();
  drawBarChart();
  //drawPolygon(testArray);
  // drawSmartDonut(testArray, cx, cy);

}

function underscoreTest() {
  var sortedState = _.groupBy(data, 'state')['CA'];

  var armingAttributes = ['dangerous', 'harmful', 'neutral', 'harmless', 'unarmed'];
  for (var i = 0; i < armingAttributes.length; i++) {
    console.log(_.groupBy(sortedState, 'arming')[armingAttributes[i]].length, armingAttributes[i]);

  }

}

function drawBarChart() {
  var marginX = 100;
  var rectArray = [];


  // var stateArray = [];
  // stateArray.push(_.indexBy(data, 'state'));
  // console.log(_.indexBy(data, 'arming'));

  var stateArray = ['AK', 'AL', 'AR', 'AZ', 'CO', 'CA', 'CT', 'DC', 'DE', 'TX',
    'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'KS', 'KY', 'LA', 'MD', 'ME', 'MA', 'MI',
    'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'OH', 'OR',
    'PA', 'RI', 'SC', 'SD', 'TN', 'UT', 'VA', 'VT', 'WI', 'WV', 'WY', 'IN', 'WA',
    'OR', 'DC', 'NY', 'OK'
  ];

  for (var i = 0; i < stateArray.length; i++) {

    var barSize = _.groupBy(data, 'state')[stateArray[i]].length;

    var xPos = (i * (paperWidth - marginX * 2) / stateArray.length) + marginX;
    // var yPos = (paperHeight - barSize) - cy;
    var yPos = paperHeight / 3 * 2 - barSize;

    rectArray.push(paper.rect(xPos, yPos, 8, barSize, 4).attr({
      fill: 'white'
    }));

    rectArray[i].click(onClick.bind(null, i));
  }

  function onClick(index) {
    console.log(index, rectArray[index]);

    for (var i = 0; i < rectArray.length; i++) {
      rectArray[i].animate({
        y: 0,
        opacity: .6
      }, 100);
    }

    rectArray[index].attr({
      fill: 'yellow',
    });
  }
}

function drawSmartDonut(array, offsetX, offsetY) {

  var raceCounted = array;

  var arcSpacing = radians(3);
  var radiusVizualization = 150;
  var offsetX;
  var offsetY;

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

      var startX = Math.sin(radianArcStart + arcSpacing) * radiusVizualization + offsetX;
      var startY = -Math.cos(radianArcStart + arcSpacing) * radiusVizualization + offsetY;

      var endX = Math.sin(radianArcEnd) * radiusVizualization + offsetX;
      var endY = -Math.cos(radianArcEnd) * radiusVizualization + offsetY;

      paper.path("M" + startX + "," + startY + "A" + radiusVizualization + "," + radiusVizualization + " 0 " + above180 + " 1 " + endX + "," + endY + "").attr({
        stroke: getColor(i * 20),
        strokeWidth: 10,
        fill: "none"
      })
    }
  }
}

function drawPolygon(array) {

  var armingCounted = array;

  // empty array to push new position coords for the polygon
  var positions = [];

  for (var i = 0; i < armingCounted.length; i++) {
    var size = 2;
    var angle = (360 / armingCounted.length * i) - 90;
    angle = radians(angle);

    //indicator for the visualisation is set on the maximum
    // var maxValue = Math.max(...armingCounted);
    var maxValue = 100;
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


//helper functions
function getColor(inputVal) {
  var func = chroma.scale(["#222", "#fff"]).domain([0, 100]);
  return func(inputVal);
}