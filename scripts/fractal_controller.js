//code for endpoint
  const params = new URLSearchParams(window.location.search);
  let code = (params.get("code"));
  let playlist_id = (params.get("playlist"));
  let avg_valence = 0;
  let avg_energy = 0;
  let mode_mode = 1;

  fetch("https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?market=US&fields=items(track(id))&limit=100&offset=0", {
    headers:
    {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + code
    }
  })
    .then(response => response.json())
    .then(data => {
      var tracks = '';
      for (i = 0; i < data.items.length; i++) {
        tracks += (data.items[i]['track']['id']) + '%2C';
      }
      var tracks = tracks.substring(0, tracks.length - 3)
      fetch('https://api.spotify.com/v1/audio-features?ids=' + tracks, {
        headers:
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + code
        }
      })
        .then(response => response.json())
        .then(data => {
          var mapping = {};
          console.log(data.audio_features[0]['mode'])
          for (i = 0; i < data.audio_features.length; i++) {
            avg_valence += (data.audio_features[i]['valence']) / data.audio_features.length;
            avg_energy += (data.audio_features[i]['energy']) / data.audio_features.length;

            if (!mapping[data.audio_features[i]['mode']]) {
              mapping[data.audio_features[i]['mode']] = 0;
            }
            mapping[data.audio_features[i]['mode']] += 1
          }
          mode_mode = parseInt(Object.keys(mapping).reduce(function (a, b) { return mapping[a] > mapping[b] ? a : b }));
          console.log(avg_valence, avg_energy, mode_mode);

        })
    })
    .catch(console.error);

//fractal controller
(function () {
  var canvas = document.getElementById("bgcanvas");
  const refreshBtn = document.getElementById("refresh");
  var fractal = new window.mandelbrotFractal.Fractal(canvas);
  console.log(fractal);
  // fractal api as an options object
  // all keys are optional
  var options = {
    // set size of canvas
    // set pixel width of canvas
    pxWidth: 300, // e.g. 2880

    // set pixel height of canvas
    pxHeight: 300, // e.g. 1800

    // reset to default settings (coordinates, max escape time, and
    // starting options - does not reset canvas size)
    defaults: true,

    // reset to default cartesian coordinates (shows the whole fractal)
    resetToDefaultCords: true,

    // draw the fractal at these specific cartesian coordinates
    cords: {
      xCartMin: -1, // e.g. -2.1
      xCartMax: 5, // e.g. 0.8,
      yCartMin: -1, // e.g. -1.2,
      yCartMax: 4, // e.g. 1.2
    },

    // set the maximum escape time
    // numbers < 14 will be converted to 14
    // numbers > 1792 will be converted to 1792
    maxEscapeTime: 224, // e.g. 224

    // pixel coordinates on canvas of point to zoom in on
    zoomInPxPoint: {
      xPx: 100, // e.g. 100
      yPx: 100, // e.g. 100
    },

    // pixel coordinates on canvas of point to zoom out from
    zoomOutPxPoint: {
      xPx: 100, // e.g. 100
      yPx: 100, // e.g. 100
    },

    // pixel coordinates of rectangle on canvas to zoom in on
    zoomInPxBox: {
      xPxMin: 50, // e.g. 50
      xPxMax: 100, // e.g. 100
      yPxMin: 50, // e.g. 50
      yPxMax: 100, // e.g. 100
    },

    // set the current options as the starting options
    // the fractal resets to its starting options when told to reset
    setAsStartingOptions: true, // e.g. true

    // reset cartesian coordinates to starting cartesian coordinates
    resetCords: true, // e.g. true

    // reset the max escape time to the starting max escape time
    resetMaxEscapeTime: true, // e.g. true

    // draw with distortion if the ratio of canvas width/height doesn't
    // match the ratio of cartesian coordinates width/height
    // by default (if this is omitted or false) the cartesian coordinates are
    // adjusted to match the ratio of the canvas width/height to avoid distortion
    distortion: true, // e.g. true

    colors: {
      valence: avg_valence,
      energy: avg_energy,
      mode: mode_mode,
    }
  };

  fractal.update(options);
})();