var ignPoint;

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(41.7718400422817, -7.9167833239285),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

   var marker = new google.maps.Marker({
    map: map,
    title: 'Burn it, go ahead, burn it to the ground',
    draggable: true
  });

  google.maps.event.addListener(map, 'click', function(event){
    var ignLat = event.latLng.lat();
    var ignLng = event.latLng.lng();
    
    ignPoint = new google.maps.LatLng(ignLat, ignLng );

    marker.setPosition(ignPoint);
  });
}
google.maps.event.addDomListener(window, 'load', initialize);

function updateRange(sliderId, rangeId){

  console.log('Button', sliderId, rangeId);

  var slider = document.getElementById(sliderId);
  var rangeValue = document.getElementById(rangeId);

  rangeValue.setAttribute('value',formatFloat(slider.value, 0));
}

function formatFloat(x, c) { 

  var power = Math.pow(10, c); 

  return Math.round(power * x)/power; 
}