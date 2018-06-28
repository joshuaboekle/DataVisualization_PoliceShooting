var paper = Snap("#svgContainer");

var paperWidth = parseInt(document.getElementById("svgContainer").getAttribute("width"));
var paperHeight = parseInt(document.getElementById("svgContainer").getAttribute("height"));

var px = paperWidth / 2;
var py = paperHeight / 2;

var selectedState = undefined;

var selectedStateEthnicityCleared;

init();

function init() {

  drawBarChart();

  // sortEthnicity();
  // sortArming();

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
    var newBarSize = map(barSize, 0, 150, 20, 200)
    var xPos = (i * (paperWidth - marginX * 2) / stateArray.length) + marginX;
    // var yPos = (paperHeight - barSize) - py;
    var yPos = paperHeight / 3 * 2 - newBarSize;

    rectArray.push(paper.rect(xPos, yPos, 8, newBarSize, 4).attr({
      fill: '#000025'
    }));

    rectArray[i].click(onClick.bind(null, i));
  }

  // triggers new draw and delivers data
  function onClick(index) {

    selectedState = stateArray[index];
    for (var i = 0; i < rectArray.length; i++) {
      rectArray[i].animate({
        y: 0
      }, 200);
    }

    rectArray[index].attr({
      fill: '#00417E',
      opacity: .8,
    });

    paper.selectAll("path").remove();

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
  var allEthnicity = ['B', 'W', 'H', 'A', 'O'];

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
      strokeWidth: 10,
      fill: 'none'
    }));

    arcArray[i].click(onClick.bind(null, i));

    function onClick(index) {
      console.log('working', 'clicked index :', index, arcArray[index]);

      // var ethnicityInState = selectedStateEthnicityCleared[index];
      // paper.selectAll("path").remove();

      arcArray[index].animate({
        strokeWidth: 20,
        stroke: 'green',
        opacity: 1
      }, 200);


      sortEthnicity();

    }
  }
}

function sortArming() {

  var sortedState = _.groupBy(data, 'state')['CA'];

  var armingAttributes = ['dangerous', 'harmful', 'neutral', 'harmless', 'unarmed'];
  for (var i = 0; i < armingAttributes.length; i++) {

    console.log(selectedState, armingAttributes[i], _.groupBy(sortedState, 'arming')[armingAttributes[i]].length);
  }
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

//helper functions

function getColor(inputVal) {
  var func = chroma.scale(["#E54652", "#81272E"]).domain([0, 70]);
  return func(inputVal);
}