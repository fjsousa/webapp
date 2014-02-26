var simulations = [];
var N = 50;

var progressInterval;
// PROGRESS BAR
var elProgressBar = document.getElementById('progress-bar');

// SIMULATION 
var ranForTheFirstTime = true;


function clearProgress() {
  elProgressBar.setAttribute('aria-valuenow', 0);
  elProgressBar.style.width = '0%';
}

function updateProgress(m, r) {
  var currentProgress = elProgressBar.getAttribute('aria-valuenow');
  var total = N + 2;
  var newProgress = (m + r) * 100 / total;

  if (currentProgress > newProgress) {
    return;
  }

  elProgressBar.setAttribute('aria-valuenow', newProgress);
  elProgressBar.style.width = newProgress + '%';
}

function closeProgress() {
  elProgressBar.setAttribute('aria-valuenow', 100);
  elProgressBar.style.width = '100%';
}

// WAITING FOR SIMULATION
function setCursorWaiting() {
  $run.button('loading');
  $body.css('cursor', 'wait');
  $run.css('cursor', 'wait');
  setTimeout(function() {
    $run.tooltip('show');
  }, 1000);
}

function setCursorAuto() {
  $body.css('cursor', 'auto');
  $run.css('cursor', 'auto');
  $run.tooltip('hide');
  $run.button('reset');

  if (!token && ranForTheFirstTime) {
    setTimeout(function() {
      $('#register-modal').modal();
    }, 6000);
    ranForTheFirstTime = false;
  }
  closeProgress();
}

// RESULTS
function setResults(sims, time, seqTime) {
  // set values
  $simulations.text(sims);
  $time.text(time);
  $seqTime.text(seqTime);
  // show
  $results.show();

  setTimeout(function() {
    $simHours.popover('show');
  }, 500);
}

function clearResults() {
  // hide
  $results.hide();
  // clear textues
  $simulations.text('');
  $time.text('');
  $seqTime.text('');
}

function runDemo(obj, url, callback) {

  console.log('Starting request to embers-ws...');

  var xhr = new XMLHttpRequest(); // new HttpRequest instance 

  xhr.open('POST', url, true);

  function update() {
    var response = xhr.response;
    var tokens = response.split('\t');
    var m = 0,
      r = 0;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      clearInterval(progressInterval);

      switch (token) {
        case 'm':
          m++;
          break;
        case 'r':
          r++;
          break;
        default:
          if (token) {
            var content = JSON.parse(token);
            callback(content.err, content.maps);
          }
          break;
      }
    }
    updateProgress(m, r);
  }

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status >= 300) {
      alert('Ooops! Connection lost! Please try again.');
      return;
    }
    if (xhr.readyState === 3) {
      update();
    }
  };

  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

  var postContent = JSON.stringify(obj);
  xhr.send(postContent);
}

function fire() {
  clearProgress();

  if (!ignPoint) {
    alert('Please, select a location by clicking on the green highlighted area on the map.');
    return;
  }

  for (i = 0; i < simulations.length; i++) {
    var sim = simulations[i];
    for (j = 0; j < sim.layers.length; j++) {
      sim.layers[j].setMap(null);
    }
    sim.layers = [];
  }
  simulations = [];

  setCursorWaiting();
  clearResults();

  var opts = {
    'ignitionPt': [ignPoint.d, ignPoint.e],
    'u': Number($wspeed.val()),
    'alpha': Number($wdirection.val()),
    'std': 30,
    'moisture': Number($moisture.val()),
    'rows': 200,
    'cols': 200,
    'height': 10000,
    'width': 10000,
    'n': N
  };

  if (token) {
    opts.credentials = {
      'token': token
    };
  }

  var url = 'https://embers.crowdprocess.com/embers-ws/fullEmbers';

  var onData = function onData(err, maps) {
    if (err) {
      return console.log(err);
    }

    var url = 'https://embers.crowdprocess.com/embers-ws/outputs/';
    var i;
    var layerOpts = {
      url: '',
      map: map
    };

    for (i = 0; i < maps.length; i++) {

      var m = maps[i];
      simulations.push(m);
      simulations[i].layers = [];

      layerOpts.url = url + m. in ;
      simulations[i].layers.push(new google.maps.KmlLayer(layerOpts));
      if (i > 0) {
        simulations[i].layers[0].setMap(null);
      }
      layerOpts.url = url + m.out;
      simulations[i].layers.push(new google.maps.KmlLayer(layerOpts));
      if (i > 0) {
        simulations[i].layers[1].setMap(null);
      }
    }

    // CURSOR
    setCursorAuto();
    setResults(10000, 123, 1230000);
  };

  runDemo(opts, url, onData);

  progressInterval = setInterval(function() {
    var currentProgress = Number(elProgressBar.getAttribute('aria-valuenow'));
    var rand = Math.floor(Math.random() * 3);
    var newProgress = currentProgress + rand;
    elProgressBar.setAttribute('aria-valuenow', newProgress);
    elProgressBar.style.width = newProgress + '%';
  }, 1000);
}

function selectLayer() {

  setTimeout(function() {
    $simHours.popover('hide');
  }, 500);
  var val = $simHours.val();

  for (i = 0; i < simulations.length; i++) {
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