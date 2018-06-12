var paper = Snap("#svgContainer");

var paperWidth = document.getElementById("svgContainer").getAttribute("width");
var paperHeight = document.getElementById("svgContainer").getAttribute("height");

init();

function init() {}

function drawAmerica() {
  deleteCanvas();
  for (var i = 0; i < shootingData.length; i++) {
    var xPos = map(shootingData[i].longitude, (0 - 160), (0 - 65), 0, paperWidth);
    var yPos = map(shootingData[i].latitude, 65, 20, 0, paperHeight);;
    // var radius = map(data[i].population, 0, 1500, 3, 30);

    var mergedData = {};
    for (var j = 0; j < shootingData.length; j++) {
      var data = shootingData[j];

      var merged = mergedData[data.stateCode];
      if (!merged) {
        merged = [];
        mergedData[data.stateCode] = merged;
      }
      merged.push(data.name);
    }
    console.log(mergedData);


    for (var k = 0; k < positionData.length; k++) {
      var stateCode = positionData[k].stateCode
      // console.log(stateCode);
      // var radius = mergedData.stateCode.length;
    }
  }
}

function drawVictimsAge() {
  deleteCanvas();
  document.addEventListener("mousemove", function(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    // console.log(mouseX, mouseY);

    for (var i = 0; i < shootingData.length; i++) {
      var xPos = map(shootingData[i].longitude, (0 - 160), (0 - 65), 0, paperWidth);
      var yPos = map(shootingData[i].latitude, 65, 20, 0, paperHeight);;
      // var radius = map(data[i].population, 0, 1500, 3, 30);
      var radius = 2;
      // var ageBoundary = 100;
      var ageBoundary = map(mouseY, paperHeight, 0, 0, 100);

      if (shootingData[i].age < ageBoundary) {
        paper.circle(xPos, yPos, radius).attr({
          fill: 'white'
        });
      }
    }

  });
}

function countRace() {
  deleteCanvas();
  var mergedData = {};
  for (var i = 0; i < shootingData.length; i++) {
    var data = shootingData[i];

    var merged = mergedData[data.race];
    if (!merged) {
      merged = [];
      mergedData[data.race] = merged;
    }

    merged.push(data.name);
  }
  var raceArray = [mergedData.W.length, mergedData.B.length, mergedData.A.length, mergedData.H.length, mergedData.N.length, mergedData.O.length]
  console.log(raceArray);
  // var allWhite = mergedData.W.length;
  // var allBlack = mergedData.B.length;
  // var allAsian = mergedData.A.length;
  // var allHispanic = mergedData.H.length;
  // var allNative = mergedData.N.length;
  // var allOthers = mergedData.O.length;

  // console.log(
  //   'White :', allWhite,
  //   'Black :', allBlack,
  //   'Asian :', allAsian,
  //   'Hispanic :', allHispanic,
  //   'Native :', allNative,
  //   'Others', allOthers,
  // );

  var xPos = 100;
  var yPos = paperHeight / 7;

  for (var i = 0; i < raceArray.length; i++) {
    var barSize = map(raceArray[i], 0, 1201, 0, 200);
    paper.rect(xPos, yPos, barSize, 10).attr({
      fill: 'white'
    });
    paper.text(xPos - 50, yPos + 10, raceArray[i]).attr({
      fill: 'white'
    });
    yPos += 40;
  }
}

function countGender() {
  deleteCanvas();
  var mergedData = {};
  for (var i = 0; i < shootingData.length; i++) {
    var data = shootingData[i];

    var merged = mergedData[data.gender];
    if (!merged) {
      merged = [];
      mergedData[data.gender] = merged;
    }

    merged.push(data.name);
  }
  var allMale = mergedData.M.length;
  var allFemale = mergedData.F.length;

  paper.circle(333, paperHeight / 2, map(allMale, 0, 2535, 0, 100)).attr({
    fill: 'blue'
  });

  paper.circle(666, paperHeight / 2, map(allFemale, 0, 2535, 0, 100)).attr({
    fill: 'pink'
  });

  console.log(allMale, allFemale);


}

function deleteCanvas() {
  paper.selectAll("circle,rect,text").remove();
}