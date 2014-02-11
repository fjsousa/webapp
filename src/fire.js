//ignPoint is a Global var

$wspeed = $('#wspeed-range');
$wdirection = $('#wdirection-range');
$moisture = $('#moisture-range');

$body = $('body');
$run = $('#run-button');

$results = $('#results');
$simulations = $('#simulations', $results);
$time = $('#time', $results);
$seqTime = $('#seq-time', $results);
$simHours = $('#sim-hours');

var simulations = [];

function setCursorWaiting(){
  $run.button('loading');
  $body.css('cursor', 'wait');
  $run.css('cursor', 'wait');
  setTimeout(function(){$run.tooltip('show');}, 1000);
}
function setCursorAuto() {
  $body.css('cursor', 'auto');
  $run.css('cursor', 'auto');
  $run.tooltip('hide');
  $run.button('reset');
}

function setResults(sims, time, seqTime) {
  // set values
  $simulations.text(sims);
  $time.text(time);
  $seqTime.text(seqTime);
  // show
  $results.show();

  setTimeout(function(){$simHours.tooltip('show');}, 500);
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

  for (i = 0; i < simulations.length; i++) {
    var sim = simulations[i];
    for (j = 0; j < sim.layers.length; j++) {
      sim.layers[j].setMap(null);
    };
    sim.layers = [];
  }
  simulations = [];

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

  console.log('MAPS:',maps);

  for (i = 0; i < maps.length; i++) {

    var m = maps[i];
    simulations.push(m);
    simulations[i].layers = [];

    layerOpts.url = url + m.in;
    simulations[i].layers.push(new google.maps.KmlLayer(layerOpts));
    if (i > 0) simulations[i].layers[0].setMap(null);
    layerOpts.url = url + m.out;
    simulations[i].layers.push(new google.maps.KmlLayer(layerOpts));
    if (i > 0) simulations[i].layers[1].setMap(null);
  }

  console.log('SIMS', simulations);
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

function selectLayer (el) {

  setTimeout(function(){$simHours.tooltip('hide');}, 500);
  var val = $simHours.val();

  for(i = 0; i < simulations.length; i++) {
    var sim = simulations[i];
    if (Number(val) === Number(sim.time)) {
      sim.layers[0].setMap(map);
      sim.layers[1].setMap(map);
    } else {
      sim.layers[0].setMap(null);
      sim.layers[1].setMap(null);
    }
  }
}

document.getElementById('run-button').addEventListener('click', fire, false);
document.getElementById('sim-hours').addEventListener('change', selectLayer, false);
