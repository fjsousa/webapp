//ignPoint is a Global var
document.getElementById('run-button').addEventListener('click', fire, false);

$wspeed = $('#wspeed-range');
$wdirection = $('#wdirection-range');
$moisture = $('#moisture-range');

$body = $('body');
$run = $('#run-button');

$results = $('#results');
$simulations = $('#simulations', $results);
$time = $('#time', $results);
$seqTime = $('#seq-time', $results);

var layers = [];

function setCursorWaiting(){
  $body.css('cursor', 'wait');
  $run.css('cursor', 'wait');
}
function setCursorAuto() {
  $body.css('cursor', 'auto');
  $run.css('cursor', 'auto');
}

function setResults(simulations, time, seqTime) {
  // set values
  $simulations.text(simulations);
  $time.text(time);
  $seqTime.text(seqTime);
  // show
  $results.show();
}
function clearResults() {
  // hide
  $results.hide();
  // clear textues
  $simulations.text('');
  $time.text('');
  $seqTime.text('');
}

function fire(){

  if (!ignPoint) {
    alert('Please, select a location by clicking on the green highlighted area on the map.');
    return;
  }

  for (i = 0; i < layers.length; i++) {
    layers[i].setMap(null);
  }
  layers = [];

  setCursorWaiting();
  clearResults();

  var opts = {
    "ignitionPt": [ignPoint.d, ignPoint.e],
    "u": Number($wspeed.val()),
    "alpha": Number($wdirection.val()),
    "std": 30,
    "moisture": Number($moisture.val()),
    // "rows": 200,
    // "cols": 200,
    "rows": 100,
    "cols": 100,
    "height": 10000,
    "width": 10000,
    // "n": 20
    "n": 2
  };

  console.log(JSON.stringify(opts));

  var url = 'http://embers.crowdprocess.com/embers-ws/fullEmbers';
  console.log('OPTS:',opts);
  runDemo(opts, url, onData );

}

function onData(err, maps) {

  if (err) {
    return console.log(err);
  }

  var url = 'http://embers.crowdprocess.com/embers-ws/outputs/';
  var i;
  var layerOpts = {
    url: '',
    map: map
  };

  for (i = 0; i < maps.length; i++) {
    var m = maps[i];
    layerOpts.url = url + m.in;
    layers.push(new google.maps.KmlLayer(layerOpts));
    layerOpts.url = url + m.out;
    layers.push(new google.maps.KmlLayer(layerOpts));
    break;
  }

  for (i = 0; i < layers.length; i++) {
    console.log( layers[i] );
  }

  // CURSOR
  setCursorAuto();
  setResults(10000, 123, 1230000);
}

function runDemo (obj, url, callback) {

  console.log('Starting request to embers-ws...');
  
  var xmlhttp = new XMLHttpRequest();// new HttpRequest instance 
  xmlhttp.open('POST', url, true);


  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      var content = JSON.parse(xmlhttp.responseText);
      console.log('CONTENT:',content);
      callback(content.err, content.maps);
    }
  };

  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  var postContent = JSON.stringify(obj);
  xmlhttp.send(postContent);
}