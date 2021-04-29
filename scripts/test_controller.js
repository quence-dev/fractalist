const canvas = document.getElementById("canvas");
const refreshBtn = document.getElementById("refresh");

// create fractal object, send it an HTML canvas element
// on which it will draw itself
var fractal = new window.mandelbrotFractal(FractalCanvasElement);

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
      xCartMin: -2.1, // e.g. -2.1
      xCartMax: 0.8, // e.g. 0.8,
      yCartMin: -1.2, // e.g. -1.2,
      yCartMax: 1.2 // e.g. 1.2
    },
  
    // set the maximum escape time
    // numbers < 14 will be converted to 14
    // numbers > 1792 will be converted to 1792
    maxEscapeTime: 224, // e.g. 224
  
    // pixel coordinates on canvas of point to zoom in on
    zoomInPxPoint: {
      xPx: 100, // e.g. 100
      yPx: 100 // e.g. 100
    },
  
    // pixel coordinates on canvas of point to zoom out from
    zoomOutPxPoint: {
      xPx: 100, // e.g. 100
      yPx: 100 // e.g. 100
    },
  
    // pixel coordinates of rectangle on canvas to zoom in on
    zoomInPxBox: {
      xPxMin: 50, // e.g. 50
      xPxMax: 100, // e.g. 100
      yPxMin: 50, // e.g. 50
      yPxMax: 100 // e.g. 100
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
    distortion: true // e.g. true
  
  }


// tell the fractal to update itself based on the options sent
// it will only redraw itself if necessary
fractal.update(options);
// refreshBtn.addEventListener("click", );