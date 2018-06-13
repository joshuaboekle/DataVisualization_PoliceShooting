var paper = Snap("#svgContainer");

var paperWidth = parseInt(document.getElementById("svgContainer").getAttribute("width"));
var paperHeight = parseInt(document.getElementById("svgContainer").getAttribute("height"));

init();

function init() {
  var testArray = [0,20,30,10,15,25];
  //console.log(data);
  //victimsPerState();
  //drawFifaViz();
  drawEthnicity(testArray);
}

function drawEthnicity(array){
  var raceCounted = array;


  for (var i = 0; i < raceCounted.length; i++) {

    var reducer = (accumulator, currentValue) => accumulator + currentValue;
    var sumArray = raceCounted.reduce(reducer);
    console.log(raceCounted[i],"von",sumArray);

    var angle = map(raceCounted[i],0,sumArray,0,360);
    console.log("Grad:",angle);

    angle = radians(angle);
    console.log("Bogenmaß:",angle);

  }

  var radius = 100;
  var centerX = paperWidth/2;
  var centerY = paperHeight/2;

  var startX =  Math.cos(0) * radius + centerX;
  var startY =  Math.sin(0) * radius + centerY;

  var endX = Math.cos(angle) * radius + centerX;
  var endY =  Math.sin(angle) * radius + centerY;

  paper.path("M"+startX+"," +startY+ "A" +radius+ ","+radius+ " 0 0 1 "+endX+ ","+endY+"").attr({
    stroke:"white",
    strokeWidth: 10
  })


}


function drawFifaViz() {

  var armingCounted = [20,30,22,17,16];

  // empty array to push new position coords for the polygon
  var positions = [];

  for (var i = 0; i < armingCounted.length; i++) {
    var size = 5;
    var angle = (360 / armingCounted.length * i)-90;
    angle = radians(angle);

    //indicator for the visualisation is set on the maximum
    var maxValue = Math.max(...armingCounted);
    var indicatorX = (paperWidth / 2) + Math.cos(angle) * size * maxValue *1.2;
    var indicatorY = (paperHeight / 2) + Math.sin(angle) * size * maxValue*1.2;

    //calculate anchor points on a circle for the polygon
    var xPos = (paperWidth / 2) + Math.cos(angle) * size * armingCounted[i];
    var yPos = (paperHeight / 2) + Math.sin(angle) * size * armingCounted[i];
    // pushes the coords in the positions array
    positions.push(Math.round(xPos),Math.round(yPos));

    paper.ellipse(indicatorX,indicatorY,2,2).attr({
      fill: "white"
    });
  }
  paper.polygon([positions[0],positions[1],
              positions[2],positions[3],
              positions[4],positions[5],
              positions[6],positions[7],
              positions[8],positions[9]]).attr({
  fill: "white"
});
}

function victimsPerState() {
  for (var i = 0; i < 51; i++) {

    var xPos = (i * paperWidth / 51);
    var yPos = paperHeight / 2;
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
  console.log(mergedData);


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

function deleteCanvas() {
  paper.selectAll("circle,rect,text").remove();
}
