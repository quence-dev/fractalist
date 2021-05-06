// https://github.com/rafgraph/fractal
// this code may be freely distributed under the GNU GPL v3 copyleft licence

(function () {
  'use strict';

  if (typeof window.mandelbrotFractal === "undefined") {
    window.mandelbrotFractal = {};
  }
  window.mandelbrotFractal.Fractal = Fractal;
  let valence = 0;
  let energy = 0;
  let mode = 0;
  let hue = 0;
  let saturation = 0;
  let lightness = 0;

  function Fractal(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.cords = {};
    this.maxEscapeTime = 0;
    this.startCords = {};
    this.startMaxEscapeTime = 0;
    this.setToDefaults();
    this.alignCordsToCanvasRatio();
  }


  Fractal.prototype.update = function (options) {
    var previousSettings = this.copyCurrentSettings();

    if (options.defaults) this.setToDefaults(); // true/false
    if (options.resetToDefaultCords) this.resetToDefaultCords(); // true/false
    if (options.resetCords) this.setCords(this.startCords); // true/false
    if (options.cords) this.setCords(options.cords);
    if (options.resetMaxEscapeTime) this.setMaxEscapeTime(this.startMaxEscapeTime); // true/false
    if (options.maxEscapeTime) this.setMaxEscapeTime(options.maxEscapeTime);
    if (options.zoomInPxPoint) this.zoomInPxPoint(options.zoomInPxPoint);
    if (options.zoomOutPxPoint) this.zoomOutPxPoint(options.zoomOutPxPoint);
    if (options.zoomInPxBox) this.zoomInPxBox(options.zoomInPxBox);
    if (options.setAsStartingOptions) this.setStartingOptions(); // true/false
    if (options.pxWidth && Math.floor(options.pxWidth) !== this.canvas.width)
      this.canvas.width = options.pxWidth;
    if (options.pxHeight && Math.floor(options.pxHeight) !== this.canvas.height)
      this.canvas.height = options.pxHeight;
    if (!options.distortion) this.alignCordsToCanvasRatio(); // by default this will run
    if (this.reDrawRequired(previousSettings)) this.draw();
    if (options.colors) this.setColors(options.colors);
  };


  Fractal.prototype.copyCurrentSettings = function () {
    return {
      cords: JSON.parse(JSON.stringify(this.cords)),
      maxEscapeTime: this.maxEscapeTime,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height
    };
  };


  Fractal.prototype.reDrawRequired = function (previousSettings) {
    if (
      previousSettings.maxEscapeTime === this.maxEscapeTime &&
      previousSettings.canvasWidth === this.canvas.width &&
      previousSettings.canvasHeight === this.canvas.height &&
      previousSettings.cords.xCartMin === this.cords.xCartMin &&
      previousSettings.cords.xCartMax === this.cords.xCartMax &&
      previousSettings.cords.yCartMin === this.cords.yCartMin &&
      previousSettings.cords.yCartMax === this.cords.yCartMax
    ) {
      return false;
    } else {
      return true;
    }
  };


  Fractal.prototype.setToDefaults = function () {
    this.resetToDefaultCords();
    this.maxEscapeTime = 224;
    this.setStartingOptions();
  };


  Fractal.prototype.resetToDefaultCords = function () {
    this.setCords({
      xCartMin: -2.1,
      xCartMax: 0.8,
      yCartMin: -1.2,
      yCartMax: 1.2
    });
    this.startCords = JSON.parse(JSON.stringify(this.cords));
  };


  Fractal.prototype.setCords = function (cords) {
    var properties = ['xCartMin', 'xCartMax', 'yCartMin', 'yCartMax'];

    properties.forEach(function (property) {
      if (!Number.isFinite(cords[property])) {
        throw "Error with " + property + " cord, its value is: " + cords[property];
      }
    });

    properties.forEach(function (property) {
      this.cords[property] = cords[property];
    }.bind(this));
  };


  Fractal.prototype.setMaxEscapeTime = function (maxEscapeTime) {
    if (maxEscapeTime > 1792) {
      this.maxEscapeTime = 1792;
    } else if (maxEscapeTime < 14) {
      this.maxEscapeTime = 14;
    } else {
      this.maxEscapeTime = Math.floor(maxEscapeTime / 7) * 7;
    }
  };


  Fractal.prototype.zoomInPxPoint = function (pxPoint) {
    var zoomMultiple = 0.2;
    this.determineZoomPxCords(zoomMultiple, pxPoint);
  };


  Fractal.prototype.zoomOutPxPoint = function (pxPoint) {
    var zoomMultiple = 5;
    this.determineZoomPxCords(zoomMultiple, pxPoint);
  };


  Fractal.prototype.zoomInPxBox = function (pxCords) {
    this.convertPxCordsToCartCords(pxCords);
  };


  Fractal.prototype.determineZoomPxCords = function (zoomMultiple, pxPoint) {
    var diffPxWidth = Math.floor(this.canvas.width * (zoomMultiple / 2));
    var diffPxHeight = Math.floor(this.canvas.height * (zoomMultiple / 2));

    var pxCords = {
      xPxMin: pxPoint.xPx - diffPxWidth,
      xPxMax: pxPoint.xPx + diffPxWidth,
      yPxMin: pxPoint.yPx - diffPxHeight,
      yPxMax: pxPoint.yPx + diffPxHeight
    };

    this.convertPxCordsToCartCords(pxCords);
  };


  Fractal.prototype.convertPxCordsToCartCords = function (pxCords) {
    var newCartCords = {
      xCartMin: this.pixelToCartX(pxCords.xPxMin),
      xCartMax: this.pixelToCartX(pxCords.xPxMax),
      yCartMin: this.pixelToCartY(pxCords.yPxMin),
      yCartMax: this.pixelToCartY(pxCords.yPxMax)
    };

    this.setCords(newCartCords);
  };


  Fractal.prototype.setStartingOptions = function () {
    this.startCords = JSON.parse(JSON.stringify(this.cords));
    this.startMaxEscapeTime = this.maxEscapeTime;
  };


  Fractal.prototype.alignCordsToCanvasRatio = function () {
    var ctWidth = this.cords.xCartMax - this.cords.xCartMin;
    var ctHeight = this.cords.yCartMax - this.cords.yCartMin;
    var pxWidth = this.canvas.width;
    var pxHeight = this.canvas.height;
    if (ctHeight / ctWidth === pxHeight / pxWidth) return;

    if (ctHeight / ctWidth < pxHeight / pxWidth) {
      var oldCtHeight = ctHeight;
      ctHeight = ctWidth * (pxHeight / pxWidth);
      var diff = ctHeight - oldCtHeight;
      this.cords.yCartMax += diff / 2;
      this.cords.yCartMin -= diff / 2;
    } else {
      var oldCtWidth = ctWidth;
      ctWidth = ctHeight * (pxWidth / pxHeight);
      diff = ctWidth - oldCtWidth;
      this.cords.xCartMax += (diff / 2);
      this.cords.xCartMin -= (diff / 2);
    }
  };


  Fractal.prototype.pixelToCartX = function (x) {
    var pxRatio = x / this.canvas.width;
    var cartWidth = this.cords.xCartMax - this.cords.xCartMin;
    return this.cords.xCartMin + (cartWidth * pxRatio);
  };


  Fractal.prototype.pixelToCartY = function (y) {
    var pxRatio = y / this.canvas.height;
    var cartHeight = this.cords.yCartMax - this.cords.yCartMin;
    return this.cords.yCartMin + (cartHeight * pxRatio);
  };


  Fractal.prototype.draw = function () {
    var imageData = this.drawToImageData();
    this.ctx.putImageData(imageData, 0, 0);

    // use the following to print size on canvas for debugging
    // var fontSize = 1.25 * devicePixelRatio;
    // this.ctx.font = "300 " + fontSize + "em Helvetica";
    // this.ctx.fillStyle = "#c0c0c0";
    // this.ctx.fillText("w: " + imageData.width + " h: " + imageData.height, 75 * devicePixelRatio, 165 * devicePixelRatio);
  };


  Fractal.prototype.drawToImageData = function () {
    var imageData = new ImageData(this.canvas.width, this.canvas.height);
    var yCart, xCart, escapeTime, rgbNum, index;

    for (var y = 0; y < imageData.height; y++) {
      yCart = this.pixelToCartY(y);

      for (var x = 0; x < imageData.width; x++) {
        xCart = this.pixelToCartX(x);
        escapeTime = this.calcEscapeTime(xCart, yCart);

        rgbNum = this.rgbNum(escapeTime);

        // debugging console log
        // console.log(x + ", " + y + " - " + Math.round(xCart * 100) / 100 + ", " + Math.round(yCart * 100) / 100 + " - " + escapeTime + " - " + rgbNum[0] + ", " + rgbNum[1] + ", " + rgbNum[2]);

        index = (y * imageData.width + x) * 4;
        imageData.data[index] = rgbNum[0];
        imageData.data[index + 1] = rgbNum[1];
        imageData.data[index + 2] = rgbNum[2];
        imageData.data[index + 3] = 255;
      }
    }

    console.log("max escape time: " + this.maxEscapeTime);
    console.log("cords: ", this.cords);
    console.log("pixels: width: " + imageData.width + ", height: " + imageData.height);
    console.log("done drawToImageData");
    return imageData;
  };


  Fractal.prototype.calcEscapeTime = function (xCart, yCart) {

    var escapeTime = 0;
    var oldX = xCart;
    var oldY = yCart;
    var newX, newY;

    while (this.distFromOrigin(oldX, oldY) < 2 && escapeTime < this.maxEscapeTime) {
      newX = (oldX * oldX) - (oldY * oldY) + xCart;
      newY = (2 * oldX * oldY) + yCart;

      oldX = newX;
      oldY = newY;

      escapeTime += 1;
    }

    return escapeTime;
  };


  Fractal.prototype.distFromOrigin = function (x, y) {
    return Math.sqrt(x * x + y * y);
  };


  Fractal.prototype.setColors = function (colors) {
    this.valence = colors.avg_valence;
    this.energy = colors.avg_energy;
    this.mode = colors.mode_mode;

    this.setHSL();
  };

  //sets HSL values based on playlist data
  Fractal.prototype.setHSL = function () {
    //check playlist values
    hue = Math.round(this.valence * 300); //change 0-1 to 0-300 integer
    saturation = this.energy;
    lightness = this.mode;

    //shift hue to correct values
    if (this.hue < 150) { //produce range 135-285
      hue = this.clamp((this.hue + 135), 135, 285);
    } else if (this.hue >= 150 && this.hue <= 255) { //produce hue range from 105-0
      hue = this.clamp((210 - (this.hue - 45)), 0, 105); //reduce 150 to 105, then reverse range
    } else { //if hue > 255
      hue = this.clamp((Math.abs(this.hue - 616)), 315, 360); //produce range 360-315
    }
  };

  //converts HSL values to RGB
  Fractal.prototype.HSLToRGB = function (h, s, l) {
    // Must be fractions of 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
  };

  //generates random number for incrementing hue
  Fractal.prototype.randNum = function () {

  };

  //clamps number at a given value
  Fractal.prototype.clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  ///////////////////////////////////////////////////////////////////////////////
  //coloring algorithm:
  //start with 2 of the 3 red, green and blue values fixed at either 0 or 255,
  //then increase the other R, G or B value in a given number of increments
  //repeat this for seven cases and you get a maximum of 1792 colors (7*256)
  //note that white repeats 3 times, at the end of cases 2, 4 and 6
  //the seven case are:
  //case 0: R=0, B=0, increase green from 0 to 255
  //case 1: R=0 G=255, increase blue from 0 to 255
  //case 2: G=255, B=255, increase red form 0 to 255
  //case 3: G=0, B=255, increase red from 0 to 255
  //case 4: R=255, B=255, increase green from 0 to 255
  //case 5: R=255, B=0, increase green from 0 to 255
  //case 6: R=255, G=255, increase blue from 0 to 255

  /* ********* NEW COLOR ALGORITHM ***********
  Major mode = convert all black [0,0,0] to white [255,255,255]
  Minor mode = convert all white [255,255,255] to black [0,0,0]
  High valence (>= 0.5) = warm colors (+red, -blue)
  Low valence (< 0.5) = cool colors (-red, +blue)
  High energy (>= 0.5) = bright colors (> 127)
  Low energy (>= 0.5) = dark colors (<= 127)
  ************ */
  ///////////////////////////////////////////////////////////////////////////////
  Fractal.prototype.rgbNum = function (escapeTime) {
    // let light_dark = 255;
    // let ld_divider = 1;
    // let black_white = 0;
    // let warm = 255;
    // let cool = 0;
    // if (mode) {
    //   black_white = 255;
    // }
    // if (valence < 0.5) {
    //   warm = 0;
    //   cool = 255;
    // }
    // if (energy < 0.5) {
    //   light_dark = 128;
    //   ld_divider = 2;
    // }



    if (escapeTime <= 2) {
      return [0, 0, 0];
    } else if (escapeTime === this.maxEscapeTime) {
      return [0, 25, 0];
    }

    let red;
    let green;
    let blue;
    let rgbIncrements = Math.floor(((this.maxEscapeTime) / 7));
    let caseNum = Math.floor(escapeTime / rgbIncrements);
    let remainNum = escapeTime % rgbIncrements;

    switch (caseNum) {
      case 0:
        // red = 255;
        // green = Math.floor(256 / rgbIncrements) * remainNum;
        // blue = 0;
        [red, green, blue] = this.HSLToRGB(this.hue, this.saturation, this.lightness);
        break;
      case 1:
        red = 0;
        green = 255;
        blue = Math.floor(256 / rgbIncrements) * remainNum;
        break;
      case 2: //black or white
        red = Math.floor(256 / rgbIncrements) * remainNum;
        green = 255;
        blue = 255;
        break;
      case 3:
        red = Math.floor(256 / rgbIncrements) * remainNum;
        green = 0;
        blue = 255;
        break;
      case 4: //black or white
        red = 255;
        green = Math.floor(256 / rgbIncrements) * remainNum;
        blue = 255;
        break;
      case 5:
        red = 255;
        green = Math.floor(256 / rgbIncrements) * remainNum;
        blue = 0;
        break;
      case 6: //black or white
        red = 255;
        green = 255;
        blue = Math.floor(256 / rgbIncrements) * remainNum;
        break;
    }

    return [red, green, blue];
  };

})();