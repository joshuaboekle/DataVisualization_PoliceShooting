var paper = Snap("#svgContainer");

var paperWidth = parseInt(document.getElementById("svgContainer").getAttribute("width"));
var paperHeight = parseInt(document.getElementById("svgContainer").getAttribute("height"));

init();

function init() {
  console.log(data);
  victimsPerState();

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