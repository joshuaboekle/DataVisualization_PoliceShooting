var paper = Snap("#svgContainer");
// get the window width and height of the browser, the sizing is not hard coded
var paperWidth = window.innerWidth;
var paperHeight = window.innerHeight;

// variables vor the center of the window
var px = paperWidth / 2;
var py = paperHeight / 2;
// after click the Smartdonut Viz tranforms with transformX
var transformX = paperWidth/12;

// determine and updates the selected state
var selectedState = undefined;

var selectedStateEthnicityCleared;
var selectedEthnicityInState;

// all available states in the dataset
var stateArray = ['AK', 'AL', 'AR', 'AZ', 'CO', 'CA', 'CT', 'DC', 'DE', 'TX',
  'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'KS', 'KY', 'LA', 'MD', 'ME', 'MA', 'MI',
  'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'OH', 'OR',
  'PA', 'RI', 'SC', 'SD', 'TN', 'UT', 'VA', 'VT', 'WI', 'WV', 'WY', 'IN', 'WA',
  'OR', 'DC', 'NY', 'OK'
];

// all available ethnicities in the dataset
var allEthnicity = ['W', 'B', 'H', 'A', 'O'];

// all available armings grades in the dataset
var armingAttributes = ['dangerous', 'harmful', 'neutral', 'harmless', 'unarmed'];

// used colors in the document
var color1= "#f6f6f6";





init();

// first function that loads
function init() {
  drawBarChart();
}

// draws data layer 01 and a bar chart vizualization
function drawBarChart() {
  var marginX = paperWidth/6;
  //empty array where the drawn bars getting pushed later
  var rectArray = [];

  // for element selection and eventhandling
  var clicked;

  //loops through the stateArray to draw 51 bars
  for (var i = 0; i < stateArray.length; i++) {

    // count the states with the underscore.js lib and looks at array length to get barSize
    var barSize = _.groupBy(data, 'state')[stateArray[i]].length;
    var barWidth = paperWidth*0.00333333;
    // maps the barSize that small values getting better visible
    var mappedBarSize = map(barSize, 0, 150, 10, 170);

    // calculates the xPos and yPos of every bar
    var xPos = (i * (paperWidth - marginX * 2) / stateArray.length) + marginX;
    var yPos = paperHeight / 3 * 2 - mappedBarSize;

    //creates a rectangle with position and barSize
    //also pushes it into the rectArray so it's accessible later
    rectArray.push(paper.rect(xPos, yPos, barWidth, mappedBarSize, barWidth/2).animate({
      fill: color1,
      opacity: .4
    },1000));

    //event handling if a rect is clicked, hovered or not is changing the style of the bars
    rectArray[i].click(onClick.bind(null, i));
    rectArray[i].mouseover(onHover.bind(null, i));
    rectArray[i].mouseout(onMouseOut.bind(null, i));

  }

  // triggers new draw and delivers data
  function onClick(index) {
    //the stateCode for the clicked state is saved
    selectedState = stateArray[index];
    //clicked is getting the index to find and animate the clicked rectangle
    clicked = index;
    console.log("clicked" + clicked);

    //same for loop when the bars was drawn the first time
    for (var i = 0; i < rectArray.length; i++) {
      var barSize = _.groupBy(data, 'state')[stateArray[i]].length;
      var mappedBarSize = map(barSize, 0, 150, 10, 170);
      // if clicked is not i then it would animate the unclicked bars
      // if clicked is i the bar gets highlighted as it is the selected element
      if (i !== clicked) {
        rectArray[i].animate({
          opacity: .4,
          y: paperHeight - 30 - mappedBarSize
        }, 200, mina.easeinout);
      } else {
        rectArray[i].animate({
          opacity: 1,
          y: paperHeight - 30 - mappedBarSize,
        }, 600, mina.easeinout);
      }
    }

    //removes other svg elements at the screen
    paper.selectAll("path,polyline,ellipse").remove();

    sortEthnicity();
  }

  function onMouseOut(index) {
    for (var i = 0; i < rectArray.length; i++) {
      if (i !== clicked) {
        rectArray[i].animate({
          opacity: .4,
        }, 200, mina.easeinout);
      } else {
        rectArray[i].animate({
          opacity: 1,
        }, 200, mina.easeinout);
      }
    }
  }

  function onHover(index) {
    hover = index;
    console.log(index);
    for (var i = 0; i < rectArray.length; i++) {

      if (i !== clicked ) {
        rectArray[i].animate({
          opacity: .4,
        }, 200, mina.easeinout);
      } else {
        rectArray[i].animate({
          opacity: 1,
        }, 200, mina.easeinout);
      }
    }

    rectArray[index].animate({
      opacity:.8
    },200)
  }
}


function sortEthnicity() {

  // gets the ethnicity data from the selectedState (underscore - groupBy)
  var sortedState = _.groupBy(data, 'state')[selectedState];

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

  drawSmartDonut(sortedEthnicity, px, py);
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
      strokeWidth: 12,
      opacity: .8,
      fill: 'none'
    }));

    arcArray[i].click(onClick.bind(null, i));

    function onClick(index) {

      // console.log('working', 'clicked index :', index, arcArray[index]);
      selectedEthnicityInState = selectedStateEthnicityCleared[index];

      console.log('selectedEthnicityInState', selectedEthnicityInState);

      paper.selectAll("ellipse,polygon,polyline").remove();
      paper.selectAll("rect").animate({
        opacity: 0
      }, 200);


      for (var i = 0; i < selectedStateEthnicityCleared.length; i++) {

        arcArray[i].animate({
          transform: "t-"+ transformX +",0",
          opacity: .6,
          strokeWidth: 12
          //  d: "M" + startX + "," + startY + "A" + radiusVizualization + "," + radiusVizualization + " 0 " + above180 + " 1 " + endX + "," + endY + ""
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

  // console.log(countedArming);
  // drawPolygon(countedArming, px, py)
  drawPolyline(countedArming, 200, -130);

}

function drawPolyline(array, offsetX, offsetY) {
  // var array = [3, 5, 10, 0, 3];

  var offsetX;
  var offsetY;

  var positions = [];
  var sizeIndicators = 2;

  var armingCounted = array;
  console.log("oldArming", armingCounted);
  if (armingCounted.length < 5) {
    console.log("arming Counted smaller than 5!!!", "Length of array: ", armingCounted.length);
    armingCounted.push(0, 0, 0, 0, 0);
    console.log("newArming", armingCounted);

  }

  for (var i = 0; i < 5; i++) {
    var indicatorX = px + offsetX;
    var indicatorY = (py + i * 70) + offsetY;

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
  var func = chroma.scale(["#9B30DB", "#A22020"]).domain([0, 70]);
  return func(inputVal);
}
