var map;
var marker;
var ignPoint;

var token = localStorage.token;

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

function initMap() {
  var mapOptions = {
    center: new google.maps.LatLng(41.7718400422817, -7.9167833239285),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  marker = new google.maps.Marker({
    map: map,
    title: 'Place the ignition point on the map',
    draggable: false
  });

  var burnableLayer = new google.maps.KmlLayer({
    // url: 'https://dl.dropboxusercontent.com/u/44524752/smallerDemoForest_WGS84.kml',
    url: 'https://crowdprocess.com/kml/smallerDemoForest_WGS84_mod.kml',
    suppressInfoWindows: true,
    map: map
  });

  google.maps.event.addListener(burnableLayer, 'click', function(event) {
    var ignLat = event.latLng.lat();
    var ignLng = event.latLng.lng();

    ignPoint = new google.maps.LatLng(ignLat, ignLng);

    marker.setPosition(ignPoint);
  });
}

function updateInnerHTML(sliderId, rangeId, unit) {

  var slider = document.getElementById(sliderId);
  var rangeValue = document.getElementById(rangeId);

  var formatFloat = function(x, c) {
    var power = Math.pow(10, c);
    return Math.round(power * x) / power;
  };

  rangeValue.innerHTML = formatFloat(slider.value, 2) + unit;
}


if (!token) {
  $wspeed.attr('disabled', 'true');
  $wspeed.val(3.78);
  $wdirection.attr('disabled', 'true');
  $wdirection.val(21);
  $moisture.attr('disabled', 'true');
  $moisture.val(2.81);
  $('div.input-tooltip').hover(function() {
    $(this).tooltip('show');
  }, function() {
    $(this).tooltip('hide');
  });
} else {
  $('div.input-tooltip').removeAttr('data-toggle');
  $('div.input-tooltip').removeAttr('data-placement');
  $('div.input-tooltip').removeAttr('data-trigger');
}

updateInnerHTML('wspeed-range', 'wspeed-input', 'm/s');
updateInnerHTML('wdirection-range', 'wdirection-input', 'º');
updateInnerHTML('moisture-range', 'moisture-input', '%');

google.maps.event.addDomListener(window, 'load', initMap);