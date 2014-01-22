//ignPoint is a Global var
document.getElementById('runButton').addEventListener('click', fire, false);

function fire(){

  if (!ignPoint) {
    alert('Please, select a location by clicking on the green highlighted area on the map.');
    return;
  }

  $wspeed = $('#wspeed-range');
  $wdirection = $('#wdirection-range');
  $moisture = $('#moisture-range');
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

  //var url = 'http://localhost:8083/runEmbers';

  runDemo(opts, url, onData );

}

function onData(err, id) {

  if (err) {
    return console.log(err);
  }

  var id = parseInt(id);

  console.log('Simulation %d returned ...', id);

  var url = 'http://embers.crowdprocess.com/embers-ws/outputs'
  //var url = 'http://localhost:8083/outputs'

  // kmlUrl.average;
  // kmlUrl.best;
  // kmlUrl.average;

  console.log('Printing Layer...');

  var mapOptions = {
    zoom: 11,
    center: ignPoint,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  }

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var ctaLayer = new google.maps.KmlLayer({
    url: url + '/output_' + id + '-averageCase.kml'
  });

  console.log(ctaLayer);

  ctaLayer.setMap(map);

}

function runDemo (obj, url, callback) {

  console.log('Starting request to embers-ws...')
  
  var xmlhttp = new XMLHttpRequest();// new HttpRequest instance 
  xmlhttp.open('POST', url, true);


  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      var content = JSON.parse(xmlhttp.responseText);

      callback(content.err, content.reqId);
    }
  }

  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  var postContent = JSON.stringify(obj);
  xmlhttp.send(postContent);
}