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

  setCursorWaiting();
  clearResults();

  if (!ignPoint) {
    alert('Please, select a location by clicking on the green highlighted area on the map.');
    return;
  }

  var opts = {
    ignitionPt: [ignPoint.d, ignPoint.e],
    U: Number($wspeed.val()),
    alpha: Number($wdirection.val()),
    std: 10,
    moisture: Number($moisture.val()),
    rows: 100,
    cols: 100,
    height: 5000,
    width: 5000

  };

  var url = 'http://embers.crowdprocess.com/embers-ws/runEmbers';

  runDemo(opts, url, onData );

}

function onData(err, id) {


  if (err) {
    return console.log(err);
  }

  id = parseInt(id);

  console.log('Simulation %d returned ...', id);

  var url = 'http://embers.crowdprocess.com/embers-ws/outputs';

  var ctaLayer = new google.maps.KmlLayer({
    url: url + '/output_' + id + '-averageCase.kml'
  });

  ctaLayer.setMap(map);

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

      callback(content.err, content.reqId);
    }
  };

  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  var postContent = JSON.stringify(obj);
  xmlhttp.send(postContent);
}