var paper = Snap("#svgContainer");
// get the window width and height of the browser, the sizing is not hard coded
var paperWidth = window.innerWidth;
var paperHeight = window.innerHeight;

// variables vor the center of the window
var px = paperWidth / 2;
var py = paperHeight / 2;

// after click the Smartdonut Viz tranforms with transformX
var transformX = paperWidth / 12;

// determine and updates the selected state
var selectedState = undefined;

// array where the sorted datas from sortEthnicity and
var selectedStateEthnicityCleared;
var selectedEthnicityInState;

// all available states in the dataset
var stateArray = ['AK', 'AL', 'AR', 'AZ', 'CO', 'CA', 'CT', 'DC', 'DE', 'TX',
  'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MD', 'ME', 'MA', 'MI',
  'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'OH', 'OR',
  'PA', 'RI', 'SC', 'SD', 'TN', 'UT', 'VA', 'VT', 'WI', 'WV', 'WY', 'WA',
  'OK', 'OR', 'NY',
];

// all available ethnicities in the dataset
var allEthnicity = ['W', 'B', 'H', 'A', 'O'];

// all available armings grades in the dataset
var armingAttributes = ['dangerous', 'harmful', 'neutral', 'harmless', 'unarmed'];


///////STYLE

var opacityUnselected = 0.35;
var opacitySelected = 1;

// used colors in the document
var color1 = "#DAE0DF";

var gradient = chroma.scale(['#861595', '#245FB5']).colors(5);





init();

// first function that loads
function init() {
  drawBarChart();

  console.log(chroma.scale(['#fafa6e', '#2A4858'])
    .mode('lch').colors(6));
}

// draws data layer 01 and a bar chart vizualization
function drawBarChart() {
  var marginX = paperWidth / 6;
  //empty array where the drawn bars getting pushed later
  var rectArray = [];

  // for element selection and eventhandling
  var clicked;

  //loops through the stateArray to draw 51 bars
  for (var i = 0; i < stateArray.length; i++) {

    // count the states with the underscore.js lib and looks at array length to get barSize
    var barSize = _.groupBy(data, 'state')[stateArray[i]].length;
    var barWidth = paperWidth * 0.00333333;
    // maps the barSize that small values getting better visible
    var mappedBarSize = map(barSize, 0, 150, 10, 170);

    // calculates the xPos and yPos of every bar
    var xPos = (i * (paperWidth - marginX * 2) / stateArray.length) + marginX;
    var yPos = paperHeight / 3 * 2 - mappedBarSize;

    //creates a rectangle with position and barSize
    //also pushes it into the rectArray so it's accessible later
    rectArray.push(paper.rect(xPos, yPos, barWidth, mappedBarSize, barWidth / 2).animate({
      fill: color1,
      opacity: opacityUnselected
    }, 1000));

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
          opacity: opacityUnselected,
          y: paperHeight - 25 - mappedBarSize
        }, 200, mina.easeinout);
      } else {
        rectArray[i].animate({
          opacity: opacitySelected,
          y: paperHeight - 25 - mappedBarSize,
        }, 600, mina.easeinout);
      }
    }

    //removes other svg elements at the screen
    paper.selectAll("path,polyline,ellipse").remove();
    //onClick start draw layer02
    sortEthnicity();
  }

  function onMouseOut(index) {
    //the if else behaves the same as in onClick but for the mouseOut
    for (var i = 0; i < rectArray.length; i++) {
      if (i !== clicked) {
        rectArray[i].animate({
          opacity: opacityUnselected,
        }, 200, mina.easeinout);
      } else {
        rectArray[i].animate({
          opacity: opacitySelected,
        }, 200, mina.easeinout);
      }
    }
  }

  function onHover(index) {
    for (var i = 0; i < rectArray.length; i++) {

      if (i !== clicked) {
        rectArray[i].animate({
          opacity: opacityUnselected,
        }, 200, mina.easeinout);
      } else {
        rectArray[i].animate({
          opacity: opacitySelected,
        }, 200, mina.easeinout);
      }
    }
    // the rect where the hover is triggered is also drawn in higher opacity
    rectArray[index].animate({
      opacity: opacitySelected
    }, 200)
  }
}

// sorts the data from layer 01 and gives it to layer 02 (drawSmartDonut)
function sortEthnicity() {

  // gets the ethnicity data from the selectedState (underscore - groupBy)
  var sortedState = _.groupBy(data, 'state')[selectedState];

  var selectedStateEthnicity = [];

  for (var i = 0; i < allEthnicity.length; i++) {
    // if in groupBy is a ethnicity not available it gives you undefined
    // this is a work around to create a new array with the available ethnicities in a state
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

    //pusht the counted values into a new array and gives it to drawSmartDonut
    sortedEthnicity.push(_.groupBy(sortedState, 'race')[selectedStateEthnicityCleared[i]].length);
  }
  // function to draw the second vizualization
  drawSmartDonut(sortedEthnicity, px, py);
}

function drawSmartDonut(array, offsetX, offsetY) {
  var raceCounted = array;
  var strokeSize = paperWidth / 100;

  // for element selection and eventhandling
  var clicked;

  var arcSpacing = radians(1.5);
  var radiusVizualization = paperWidth / 8;
  var offsetX;
  var offsetY;

  //empty array where the calculated radiants getting pushed
  var radiants = [];

  //get the sum of the whole array so it can be mapped to 360 degree
  var reducer = (accumulator, currentValue) => accumulator + currentValue;
  var sumArray = raceCounted.reduce(reducer);

  //calculates the radiants of every element in the raceCounted array and pushes it into the empty radiants array
  for (var i = 0; i < raceCounted.length; i++) {
    var angle = map(raceCounted[i], 0, sumArray, 0, 360);
    rad = radians(angle);

    radiants.push(rad);
  }

  //empty array whre the calculated positions getting pushed
  var positions = [];

  //loop to create an array with [[start,end],[start,end]]
  var currentPosition = 0; // for the following loop
  for (var i = 0; i < radiants.length; i++) {
    positions.push([]);
    var start = currentPosition;
    var end = currentPosition + radiants[i];

    positions[i].push(start);
    positions[i].push(end);
    currentPosition += radiants[i];
  }
  //array where the paper.path getting pushed
  var arcArray = [];

  for (var i = 0; i < radiants.length; i++) {
    for (var j = 0; j < positions[i].length; j++) {
      var radianArcStart = positions[i][0];
      var radianArcEnd = positions[i][1];
      //if the radiant is above 180 a the sweep-flag in the svg path need to be 1 if not 0
      var above180 = 0;
      if (radiants[i] > radians(180)) {
        above180 = 1;
      }
    }
    // calculate start point
    var startX = Math.sin(radianArcStart + arcSpacing) * radiusVizualization + offsetX;
    var startY = -Math.cos(radianArcStart + arcSpacing) * radiusVizualization + offsetY;

    // calculate end point
    var endX = Math.sin(radianArcEnd) * radiusVizualization + offsetX;
    var endY = -Math.cos(radianArcEnd) * radiusVizualization + offsetY;

    // draws a arc type svg path and getting pushed into the array
    arcArray.push(paper.path("M" + startX + "," + startY + "A" + radiusVizualization + "," + radiusVizualization + " 0 " + above180 + " 1 " + endX + "," + endY + "").attr({
      stroke: gradient[i],
      // stroke: 'white',
      strokeWidth: strokeSize,
      opacity: .6,
      fill: 'none'
    }));


    // eventhandler for arcs
    arcArray[i].click(onClick.bind(null, i));
    arcArray[i].mouseover(onHover.bind(null, i));
    arcArray[i].mouseout(onMouseOut.bind(null, i));

    function onClick(index) {
      clicked = index;
      selectedEthnicityInState = selectedStateEthnicityCleared[index];

      paper.selectAll("ellipse,polygon,polyline").remove();
      paper.selectAll("rect").animate({
        opacity: 0
      }, 200);

      for (var i = 0; i < selectedStateEthnicityCleared.length; i++) {
        arcArray[i].animate({
          transform: "t-" + transformX + ",0",
          opacity: .6,
          strokeWidth: strokeSize
        }, 200, mina.easeinout);
      }

      arcArray[index].animate({
        strokeWidth: strokeSize * 1.35,
        opacity: 1
      }, 200);

      sortArming();
    }

    function onMouseOut(index) {
      //the if else behaves the same as in onClick but for the mouseOut
      for (var i = 0; i < arcArray.length; i++) {
        if (i !== clicked) {
          arcArray[i].animate({
            opacity: .6
          }, 200);
        } else {
          arcArray[i].animate({
            opacity: 1
          }, 200);
        }
      }
    }

    function onHover(index) {
      for (var i = 0; i < arcArray.length; i++) {

        if (i !== clicked) {
          arcArray[i].animate({
            opacity: .6,
          }, 200, mina.easeinout);
        } else {
          arcArray[i].animate({
            opacity: 1,
          }, 200, mina.easeinout);
        }
      }
      // the rect where the hover is triggered is also drawn in higher opacity
      arcArray[index].animate({
        opacity: 1
      }, 200)
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
  drawPolyline(countedArming, (paperWidth / 10), -130);

}

function drawPolyline(array, offsetX, offsetY) {

  var offsetX;
  var offsetY;

  var positions = [];
  var sizeIndicators = 2;

  var armingCounted = array;
  if (armingCounted.length < 5) {

    armingCounted.push(0, 0, 0, 0, 0);

  }

  for (var i = 0; i < 5; i++) {
    var indicatorX = px + offsetX;
    var indicatorY = (py + i * 70) + offsetY;

    var xPos = indicatorX + (armingCounted[i] * 5);
    var yPos = indicatorY;

    paper.ellipse(indicatorX, indicatorY, sizeIndicators, sizeIndicators).attr({
      fill: color1,
      opacity: .3
    });

    positions.push(xPos, yPos);

  }
  paper.polyline(positions).attr({
    stroke: color1,
    strokeWidth: 2,

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
  var func = chroma.scale(['yellow', '008ae5']).domain([20, 85]).mode('lch');
  return func(inputVal);
}