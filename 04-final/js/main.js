var paper = Snap("#svgContainer");

var paperWidth = parseInt(document.getElementById("svgContainer").getAttribute("width"));
var paperHeight = parseInt(document.getElementById("svgContainer").getAttribute("height"));

var px = paperWidth / 2;
var py = paperHeight / 2;

var selectedState = undefined;

var selectedStateEthnicityCleared;
var selectedEthnicityInState;

init();

function init() {

  drawBarChart();
  // drawPolyline();
  // sortEthnicity();
  // sortArming();

}





function drawBarChart() {
  var marginX = 150;
  var rectArray = [];

  var stateArray = ['AK', 'AL', 'AR', 'AZ', 'CO', 'CA', 'CT', 'DC', 'DE', 'TX',
    'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'KS', 'KY', 'LA', 'MD', 'ME', 'MA', 'MI',
    'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'OH', 'OR',
    'PA', 'RI', 'SC', 'SD', 'TN', 'UT', 'VA', 'VT', 'WI', 'WV', 'WY', 'IN', 'WA',
    'OR', 'DC', 'NY', 'OK'
  ];

  for (var i = 0; i < stateArray.length; i++) {

    var barSize = _.groupBy(data, 'state')[stateArray[i]].length;
    var newBarSize = map(barSize, 0, 150, 10, 170)
    var xPos = (i * (paperWidth - marginX * 2) / stateArray.length) + marginX;
    // var yPos = (paperHeight - barSize) - py;
    var yPos = paperHeight / 3 * 2 - newBarSize;

    rectArray.push(paper.rect(xPos, yPos, 7, newBarSize, 3.5).attr({
      fill: 'white'
    }));

    rectArray[i].click(onClick.bind(null, i));
  }

  // triggers new draw and delivers data
  function onClick(index) {

    selectedState = stateArray[index];
    for (var i = 0; i < rectArray.length; i++) {
      rectArray[i].animate({
        opacity: .6,
        y: 0
      }, 200);
    }

    rectArray[index].animate({
      opacity: 1,
    }, 200);

    paper.selectAll("path,polygon,ellipse").remove();

    console.log('selectedState', selectedState);

    sortEthnicity();

    // event listener und dispatch anschauen
    // dispatchEvent('coolerName', {
    //   data: sfhshgf
    // })

  }
}

function sortEthnicity() {

  // gets the ethnicity data from the selectedState (underscore - groupBy)
  var sortedState = _.groupBy(data, 'state')[selectedState];

  // all available ethnicities in the dataset
  var allEthnicity = ['H', 'B', 'W', 'A', 'O'];

  var selectedStateEthnicity = [];

  for (var i = 0; i < allEthnicity.length; i++) {
    // for schleife für fehlerbehebung da in underscore undefined objects entstehen
    for (var j = 0; j < sortedState.length; j++) {

      if (sortedState[j].race.includes(allEthnicity[i]) === true) {

        //pushes all available ethnicities strings into a new Array
        selectedStateEthnicity.push(allEthnicity[i]);
      }
    }
  }


  //clears the duplicates out of the selectedStateEthnicity Array
  selectedStateEthnicityCleared = _.uniq(selectedStateEthnicity);

  // the counted persons of each ethnicity is going in here
  var sortedEthnicity = [];

  for (var i = 0; i < selectedStateEthnicityCleared.length; i++) {

    //pusht die Zahlen in das sortedEthicity array, welches an drawSmartDonut weitergegeben wird
    sortedEthnicity.push(_.groupBy(sortedState, 'race')[selectedStateEthnicityCleared[i]].length);
  }

  drawSmartDonut(sortedEthnicity, px, py)
}

function drawSmartDonut(array, offsetX, offsetY) {
  var raceCounted = array;

  var arcSpacing = radians(1.5);
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

  var arcArray = [];

  for (var i = 0; i < radiants.length; i++) {
    for (var j = 0; j < positions[i].length; j++) {
      var radianArcStart = positions[i][0];
      var radianArcEnd = positions[i][1];

      var above180 = 0;
      if (radiants[i] > radians(180)) {
        above180 = 1;
      }
    }

    var startX = Math.sin(radianArcStart + arcSpacing) * radiusVizualization + offsetX;
    var startY = -Math.cos(radianArcStart + arcSpacing) * radiusVizualization + offsetY;

    var endX = Math.sin(radianArcEnd) * radiusVizualization + offsetX;
    var endY = -Math.cos(radianArcEnd) * radiusVizualization + offsetY;

    arcArray.push(paper.path("M" + startX + "," + startY + "A" + radiusVizualization + "," + radiusVizualization + " 0 " + above180 + " 1 " + endX + "," + endY + "").attr({
      stroke: getColor(i * 20),
      // stroke: 'white',
      strokeWidth: 8,
      opacity: .6,
      fill: 'none'
    }));

    arcArray[i].click(onClick.bind(null, i));

    function onClick(index) {

      // console.log('working', 'clicked index :', index, arcArray[index]);
      selectedEthnicityInState = selectedStateEthnicityCleared[index];

      console.log('selectedEthnicityInState', selectedEthnicityInState);

      paper.selectAll("ellipse,polygon,polyline").remove();

      for (var i = 0; i < selectedStateEthnicityCleared.length; i++) {
        arcArray[i].animate({
          opacity: .6,
          strokeWidth: 8
        }, 200);
      }

      arcArray[index].animate({
        strokeWidth: 16,
        opacity: 1
      }, 200);

      sortArming();

    }
  }
}

function sortArming() {
  var armingAttributes = ['neutral', 'dangerous', 'harmful', 'harmless', 'unarmed'];

  var sortedState = _.groupBy(data, 'state')[selectedState];
  var sortedEthnicityInState = _.groupBy(sortedState, 'race')[selectedEthnicityInState];

  var selectedArming = [];

  for (var i = 0; i < armingAttributes.length; i++) {
    // for schleife für fehlerbehebung da in underscore undefined objects entstehen
    for (var j = 0; j < sortedEthnicityInState.length; j++) {

      if (sortedEthnicityInState[j].arming.includes(armingAttributes[i]) === true) {

        //pushes all available ethnicities strings into a new Array
        selectedArming.push(armingAttributes[i]);
      }
    }
  }

  //clears the duplicates out of the selectedStateEthnicity Array
  selectedArmingCleared = _.uniq(selectedArming);

  // the counted persons of each ethnicity is going in here
  var countedArming = [];

  for (var i = 0; i < selectedArmingCleared.length; i++) {

    //pusht die Zahlen in das sortedEthicity array, welches an drawSmartDonut weitergegeben wird
    countedArming.push(_.groupBy(sortedEthnicityInState, 'arming')[selectedArmingCleared[i]].length);
  }

  console.log(countedArming);
  // drawPolygon(countedArming, px, py)
  drawPolyline(countedArming);

}

function drawPolygon(array, offsetX, offsetY) {
  var offsetX;
  var offsetY;

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
    var indicatorX = offsetX + Math.cos(angle) * size * maxValue * 1.2;
    var indicatorY = offsetY + Math.sin(angle) * size * maxValue * 1.2;

    //calculate anchor points on a circle for the polygon
    var xPos = offsetX + Math.cos(angle) * size * armingCounted[i];
    var yPos = offsetY + Math.sin(angle) * size * armingCounted[i];
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

function drawPolyline(array, offsetX, offsetY) {
  // var testArray = [3, 5, 10, 0, 3];
  var testArray = array;

  var offsetX;
  var offsetY;

  var positions = [];
  var sizeIndicators = 2;

  var armingCounted = testArray;

  for (var i = 0; i < 5; i++) {
    var indicatorX = px;
    var indicatorY = py + i * 50;

    var xPos = indicatorX + (armingCounted[i] * 5);
    var yPos = indicatorY;

    paper.ellipse(indicatorX, indicatorY, sizeIndicators, sizeIndicators).attr({
      fill: 'white',
      opacity: .3
    });

    positions.push(xPos, yPos);

  }
  var g = paper.gradient("l(0, 0, 1, 1)#000-#f00-#fff");
  paper.polyline(positions).attr({
    stroke: 'white',
    strokeWidth: 3,
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  });
}

//helper functions

function getColor(inputVal) {
  var func = chroma.scale(["#9B30DB", "#A22020"]).domain([0, 60]);
  return func(inputVal);
}