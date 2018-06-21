init();

function init() {
  sortArray();
}

function sortArray() {

  var sortedState = ['B', 'W', 'H', 'O', 'B', 'B', 'W', 'H', 'O', 'W', 'H', 'O', 'B', 'B', 'W', 'H', 'B', 'B', 'W', 'H']
  var allEthnicity = ['B', 'W', 'H', 'A', 'O'];

  var selectedStateEthnicity = [];
  var sortedEthnicity = []



  for (var i = 0; i < allEthnicity.length; i++) {
    // schleife für fehlerbehebung da in underscore undefined objects entstehen
    for (var j = 0; j < sortedState.length; j++) {
      if (sortedState[j] === allEthnicity[i]) {

        //irgendwas das mir nur die verfügbaren ethnizitäten anzeigt und in ein neues Array speziell für den selectedState packt
        console.log(allEthnicity[i] + ' is available');

        // jeder string soll nur einmal in das neue Array geschoben werden
        selectedStateEthnicity.push(allEthnicity[i]);
      }
    }
  }

  // console.log(selectedStateEthnicity);
  console.log(sortedState.includes('B'));
}